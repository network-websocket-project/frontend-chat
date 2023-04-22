import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import defaulProfile from "../assets/DefaultProfile.svg";
import { apiClient } from "../utils/apiClient";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";

const ENDPOINT = "http://localhost:30555";
var socket, selectChatCompare;

// const messageList = [{ sender: "nart", text: "Hi!" }, { sender: "plub", text: "Anyone there?" }, { sender: "asia", text: "Me" }, { sender: "yuan", text: "Let go out side!" }];
const ChatRoomPage = () => {
  const authCtx = useContext(AuthContext);
  const [selectChat, setSelectChat] = useState();
  const [selectChatId, setSelectChatId] = useState();
  const [chatList, setChatList] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchAllUser = async () => {
      let response = await apiClient.get("/user");
      const chatListTest = response.data;
      response = await apiClient.get("/noti");
      const checks = response.data;
      chatListTest.forEach((chat) => {
        chat["isGroup"] = false;
        if (
          checks.findIndex(
            (check) =>
              check.isGroup === false &&
              chat._id === check.sender &&
              authCtx.userInfo._id === check.receiver &&
              check.isNoti === true
          ) !== -1
        ) {
          console.log(chat._id);
          chat.isNoti = true;
        } else {
          chat.isNoti = false;
        }
      });
      setChatList(chatListTest);
    };
    const fetchAllGroupChat = async () => {
      let response = await apiClient.get("/chat/myGroupChat");
      console.log(response.data);
      const groupChatListTest = response.data;
      response = await apiClient.get("/noti");
      const checks = response.data;
      groupChatListTest.forEach((groupChat) => {
        groupChat["isGroup"] = true;
        if (
          checks.findIndex(
            (check) =>
              check.chat === groupChat._id &&
              check.receiver === authCtx.userInfo._id &&
              check.isNoti === true
          ) !== -1
        ) {
          groupChat.isNoti = true;
        } else {
          groupChat.isNoti = false;
        }
      });
      console.log(groupChatListTest);
      setChatList((prev) => [...prev, ...groupChatListTest]);
    };
    if (socketConnected && authCtx.userInfo) {
      fetchAllUser();
      fetchAllGroupChat();
    }
  }, [socketConnected, authCtx.userInfo]);

  const fetchMessage = async () => {
    try {
      const { data } = await apiClient.get(`message/${selectChatId}`);
      let initialMessage = [];
      data.forEach((element) => {
        initialMessage.push({
          sender: element.sender.nickname,
          content: element.content,
        });
      });
      // console.log(initialMessage);
      setMessageList(initialMessage);
      const scrollHeight = messageRef.current.scrollHeight;
      const height = messageRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messageRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (selectChatId) {
      fetchMessage();
      selectChatCompare = selectChatId;
    }
  }, [selectChatId]);

  useEffect(() => {
    if (authCtx.userInfo && !socketConnected) {
      socket = io(ENDPOINT);
      socket.emit("setup", authCtx.userInfo);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, [authCtx.userInfo]);

  useEffect(() => {
    if (authCtx.userInfo && socketConnected && chatList.length > 0) {
      socket.off("message received");
      socket.on("message received", async (newMessageRecieved) => {
        console.log(
          newMessageRecieved,
          selectChatCompare,
          selectChatId,
          newMessageRecieved.chat._id
        );
        if (
          !selectChatCompare ||
          selectChatId !== newMessageRecieved.chat._id
        ) {
          console.log(newMessageRecieved);
          setChatList((prevArray) =>
            prevArray.map((chat) => {
              if (
                chat.isGroup === true &&
                newMessageRecieved.chat._id === chat._id
              ) {
                return { ...chat, isNoti: true }; // update the age of the object with id 2
              }
              if (chat.isGroup === false) {
                if (
                  chat._id === newMessageRecieved.sender._id &&
                  newMessageRecieved.chat.isGroupChat === false
                ) {
                  console.log("found");
                  chat.isNoti = true;
                }
              }
              return chat; // return all other objects unchanged
            })
          );
        } else {
          const message = {
            sender: newMessageRecieved.sender.nickname,
            content: newMessageRecieved.content,
          };
          console.log(selectChatId);
          const data = JSON.stringify({ chatId: selectChatId });
          const res = await apiClient.put("/noti", data, {
            headers: { "Content-Type": "application/json" },
          });
          setMessageList((prev) => [...prev, message]);
        }
      });
    }
  }, [authCtx.userInfo, selectChatId, socketConnected, chatList]);
  const chatChangeHandler = async (chat) => {
    if (chat === selectChat) return;
    socket.off("message received");
    if (selectChatId) socket.emit("leave chat", selectChatId);
    if (chat.isGroup === false) {
      let userId = chat._id; //This give partner Id
      let data = JSON.stringify({ userId });
      const res = await apiClient.post("/chat", data, {
        headers: { "Content-Type": "Application/json" },
      });
      if (chat.isNoti === true) {
        try {
          data = JSON.stringify({ chatId: res.data._id });
          await apiClient.put("/noti", data, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.log(err);
        }
      }
      setSelectChatId(res.data._id);
      setSelectChat(chat);
      socket.emit("join chat", res.data._id);
    } else if (chat.isGroup === true) {
      if (chat.isNoti === true) {
        try {
          const data = JSON.stringify({ chatId: chat._id });
          const res = await apiClient.put("/noti", data, {
            headers: { "Content-Type": "application/json" },
          });
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      }
      setSelectChatId(chat._id); //This shall give group Id
      setSelectChat(chat);
      console.log(chat._id);
      socket.emit("join chat", chat._id);
    }
    setChatList((prevArray) =>
      prevArray.map((chatt) => {
        if (chatt._id === chat._id) {
          chat.isNoti = false;
        }
        return chatt; // return all other objects unchanged
      })
    );
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      setNewMessage("");
      event.target.value = "";
      socket.emit("stop typing", selectChatId);
      let content = newMessage,
        chatId = selectChatId;
      console.log(content, chatId);
      let input = JSON.stringify({ content, chatId });
      const { data } = await apiClient.post("/message", input, {
        headers: { "Content-Type": "Application/json" },
      });
      console.log("helloWorld1!");
      const dataChat = JSON.stringify({
        chatId,
        isGroup: selectChat.isGroup,
      });
      console.log("helloWorld2!");
      await apiClient.post("/noti", dataChat, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("helloWorld3!");
      const message = { sender: data.sender.nickname, content: data.content };
      setMessageList((prev) => [...prev, message]);
      socket.emit("new message", data);
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChatId);
    }
    let lastTypeTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypeTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectChatId);
        setTyping(false);
      }
    }, timerLength);
  };
  const messageRef = useRef();
  useEffect(() => {
    // console.log(messageList);
    if (
      messageList.length === 0 ||
      messageList[messageList.length - 1].sender !== authCtx.userInfo.nickname
    ) {
    } else {
      const scrollHeight = messageRef.current.scrollHeight;
      const height = messageRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messageRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [messageList]);

  console.log(chatList);

  return (
    <>
      <Navbar />
      <div className="flex flex-row mt-[10vh]">
        <div className="w-1/4 border-r-4 border-[#1F1C32] h-[90vh] bg-[#151223] flex-flex-col px-4 font-montserrat pt-2">
          <div className="text-white font-montserrat font-bold text-xl">
            Chats
          </div>
          <input
            placeholder="Find Chat"
            className="flex px-2 rounded-lg justify-self-center my-4 border-2 border-[#1F1C32] placeholder:text-[#1F1C32] bg-[#151223] text-white font-bold py-2 w-full"
          ></input>
          <div className="flex flex-col overflow-y-scroll gap-y-1">
            {chatList.map((chat, i) => {
              return (
                <ProfileCard
                  group={chat.isGroup}
                  name={chat.isGroup ? chat.chatName : chat.nickname}
                  noti={chat.isNoti ? chat.isNoti : false}
                  key={i}
                  onClick={chatChangeHandler.bind(null, chat)}
                />
              );
            })}
          </div>
        </div>
        {selectChat && (
          <div className="w-full bg-[#151223] h-[90vh] px-8 pt-4 pb-8 flex flex-col overflow-y-scroll">
            <ProfileCard
              group={selectChat.isGroup}
              name={
                selectChat.isGroup ? selectChat.chatName : selectChat.nickname
              }
              large
            />
            <div
              className="flex flex-col h-2/3 my-4 bg-[#151223] gap-y-4 px-2 overflow-y-scroll"
              ref={messageRef}
            >
              {messageList.map((message, i) => {
                // console.log(message.sender, authCtx.userInfo.nickname);
                return (
                  <div className="flex flex-row items-center gap-x-2" key={i}>
                    <img
                      src={defaulProfile}
                      className={`w-8 ${
                        message.sender === authCtx.userInfo.nickname
                          ? "collapse"
                          : "visible"
                      }`}
                    />
                    <div
                      className={
                        message.sender === authCtx.userInfo.nickname
                          ? "text-end text-xl text-white font-bold bg-[#4E38A1] rounded-lg w-full pt-2 pb-3 px-8"
                          : "text-xl text-start text-[#6D6B7C] font-bold bg-[#19182D] rounded-lg w-full pt-2 pb-3 px-8"
                      }
                    >
                      {message.content}
                    </div>
                    <img src={defaulProfile} className="w-8 collapse" />
                  </div>
                );
              })}
            </div>
            {isTyping && (
              <div className="text-white font-montserrat">
                Someone is typing....
              </div>
            )}
            <input
              placeholder="Write a message"
              className="flex px-8 rounded-lg my-4 border-2 border-[#1F1C32] placeholder:text-[#1F1C32] bg-[#151223] text-white font-bold py-2 mx-12"
              onKeyDown={sendMessage}
              onChange={typingHandler}
            ></input>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatRoomPage;
