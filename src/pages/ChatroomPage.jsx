import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import defaulProfile from "../assets/DefaultProfile.svg"
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
            const response = await apiClient.get("/user");
            const chatListTest = response.data;
            chatListTest.forEach(chat => {
                chat["isGroup"] = false;
            });
            setChatList(chatListTest);
        }
        const fetchAllGroupChat = async () => {
            const response = await apiClient.get("/chat/myGroupChat");
            const groupChatListTest = response.data;
            groupChatListTest.forEach(groupChat => {
                groupChat["isGroup"] = true;
            })
            setChatList((prev) => [...prev, ...groupChatListTest]);
        }
        fetchAllUser();
        fetchAllGroupChat();
    }, [])

    const fetchMessage = async () => {
        try {
            const { data } = await apiClient.get(`message/${selectChatId}`);
            let initialMessage = [];
            data.forEach(element => {
                initialMessage.push({ sender: element.sender.nickname, content: element.content });
            });
            // console.log(initialMessage);
            setMessageList(initialMessage);
            const scrollHeight = messageRef.current.scrollHeight;
            const height = messageRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            messageRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (selectChatId) {
            fetchMessage();
            selectChatCompare = selectChatId;
        }
    }, [selectChatId])

    useEffect(() => {
        if (authCtx.userInfo) {
            socket = io(ENDPOINT);
            socket.emit("setup", authCtx.userInfo);
            socket.on("connected", () => setSocketConnected(true));
            socket.on("typing", () => setIsTyping(true));
            socket.on("stop typing", () => setIsTyping(false));
        }
    }, [authCtx.userInfo]);

    useEffect(() => {
        if (authCtx.userInfo) {
            socket.on("message received", (newMessageRecieved) => {
                console.log(newMessageRecieved, selectChatCompare, selectChatId, newMessageRecieved.chat._id);
                if (!selectChatCompare || selectChatId !== newMessageRecieved.chat._id) {
                    console.log("notification");
                    const tempChatList = chatList;
                    tempChatList.forEach(async chat => {
                        if (chat.isGroup === true && newMessageRecieved.chat._id === chat._id) {
                            chat.isNoti = true;
                        } else if (chat.isGroup === false) {
                            try {
                                if (chat._id === newMessageRecieved.sender._id) {
                                    console.log("found");
                                    chat.isNoti = true;
                                }
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }
                    });
                    console.log(tempChatList);
                    setChatList(tempChatList);
                }
                else {
                    const message = { sender: newMessageRecieved.sender.nickname, content: newMessageRecieved.content };
                    setMessageList((prev) => [...prev, message]);
                }
            });
        }
    }, [authCtx.userInfo, selectChatId]);
    const chatChangeHandler = async (chat) => {
        if (chat === selectChat) return;
        // console.log(typeof selectChatId === "string");
        socket.off("message received");
        if (selectChatId) socket.emit("leave chat", selectChatId);
        if (chat.isGroup === false) {
            let userId = chat._id; //This give partner Id
            let data = JSON.stringify({ userId });
            const res = await apiClient.post("/chat", data, {
                headers: { "Content-Type": "Application/json" }
            });
            setSelectChatId(res.data._id);
            setSelectChat(chat);
            socket.emit("join chat", res.data._id);
        } else if (chat.isGroup === true) {
            setSelectChatId(chat._id); //This shall give group Id
            setSelectChat(chat);
            console.log(chat._id);
            socket.emit("join chat", chat._id);
        }
        // const tempChatList = chatList;
        // tempChatList.forEach(cmpChat => {
        //     if (cmpChat === chat) cmpChat.isNoti = false;
        // });
        // setChatList(tempChatList);
    }
    // console.log(`chatId:${selectChatId}`);
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            setNewMessage("");
            event.target.value = "";
            socket.emit("stop typing", selectChatId);
            let content = newMessage, chatId = selectChatId;
            console.log(content, chatId);
            let input = JSON.stringify({ content, chatId });
            const { data } = await apiClient.post("/message", input, {
                headers: { "Content-Type": "Application/json" }
            });
            socket.emit("new message", data);
            // console.log(data);
            const message = { sender: data.sender.nickname, content: data.content };
            setMessageList((prev) => [...prev, message]);
            // console.log(messageList);
            // console.log("send!");
        }

    }
    // console.log(selectChat);
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
    }
    const messageRef = useRef();
    useEffect(() => {
        // console.log(messageList);
        if (messageList.length === 0 || messageList[messageList.length - 1].sender !== authCtx.userInfo.nickname) {
            return;
        }
        const scrollHeight = messageRef.current.scrollHeight;
        const height = messageRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        messageRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }, [messageList])

    return (
        <>
            <Navbar />
            <div className="flex flex-row mt-[10vh]">
                <div className="w-1/4 border-r-4 border-[#1F1C32] h-[90vh] bg-[#151223] flex-flex-col px-4 font-montserrat pt-2">
                    <div className="text-white font-montserrat font-bold text-xl">Chats</div>
                    <input placeholder="Find Chat" className="flex px-2 rounded-lg justify-self-center my-4 border-2 border-[#1F1C32] placeholder:text-[#1F1C32] bg-[#151223] text-white font-bold py-2 w-full" ></input>
                    <div className="flex flex-col overflow-y-scroll gap-y-1">
                        {chatList.map((chat, i) => {
                            if (chatList.error === true) return;
                            return <ProfileCard group={chat.isGroup} name={chat.isGroup ? chat.chatName : chat.nickname} noti={chat.isNoti} key={i} onClick={chatChangeHandler.bind(null, chat)} />
                        })}
                    </div>
                </div>
                {selectChat && <div className="w-full bg-[#151223] h-[90vh] px-8 pt-4 pb-8 flex flex-col overflow-y-scroll">
                    <ProfileCard group={selectChat.isGroup} name={selectChat.isGroup ? selectChat.chatName : selectChat.nickname} large />
                    <div className="flex flex-col h-2/3 my-4 bg-[#151223] gap-y-4 px-2 overflow-y-scroll" ref={messageRef}>
                        {messageList.map((message, i) => {
                            // console.log(message.sender, authCtx.userInfo.nickname);
                            return (
                                <div className="flex flex-row items-center gap-x-2" key={i}>
                                    <img src={defaulProfile} className={`w-8 ${message.sender === authCtx.userInfo.nickname ? "collapse" : "visible"}`} />
                                    <div className={message.sender === authCtx.userInfo.nickname ? "text-end text-xl text-white font-bold bg-[#4E38A1] rounded-lg w-full pt-2 pb-3 px-8" :
                                        "text-xl text-start text-[#6D6B7C] font-bold bg-[#19182D] rounded-lg w-full pt-2 pb-3 px-8"}>{message.content}</div>
                                    <img src={defaulProfile} className="w-8 collapse" />

                                </div>
                            )

                        })}

                    </div>
                    {isTyping && <div className="text-white font-montserrat">Someone is typing....</div>}
                    <input placeholder="Write a message" className="flex px-8 rounded-lg my-4 border-2 border-[#1F1C32] placeholder:text-[#1F1C32] bg-[#151223] text-white font-bold py-2 mx-12" onKeyDown={sendMessage} onChange={typingHandler}></input>

                </div>}
            </div>

        </>
    )
}



export default ChatRoomPage;