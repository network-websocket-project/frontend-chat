import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import defaulProfile from "../assets/DefaultProfile.svg"


const chatList = [{ name: "Asia", isGroup: false, }, { name: "Dota2", isGroup: true }];
const messageList = [{ sender: "nart", text: "Hi!" }, { sender: "plub", text: "Anyone there?" }, { sender: "asia", text: "Me" }, { sender: "yuan", text: "Let go out side!" }];
const ChatRoomPage = () => {

    const [selectChat, setSelectChat] = useState();

    return (
        <>
            <Navbar />
            <div className="flex flex-row mt-[10vh]">
                <div className="w-1/4 border-r-4 border-[#1F1C32] h-[90vh] bg-[#151223] flex-flex-col px-4 font-montserrat pt-2">
                    <div className="text-white">Chats</div>
                    <input placeholder="Find Chatter" className="flex px-2 rounded-lg justify-self-center my-4 border-2 border-[#1F1C32] placeholder:text-[#1F1C32] bg-[#151223] text-white font-bold py-2 w-full" ></input>
                    <div className="flex flex-col overflow-y-scroll">
                        {chatList.map((chat, i) => {
                            return <ProfileCard group={chat.isGroup} name={chat.name} key={i} onClick={setSelectChat.bind(null, chat)} />
                        })}
                    </div>
                </div>
                {selectChat && <div className="w-full bg-[#151223] h-[90vh] px-8 pt-4 pb-8">
                    <ProfileCard group={selectChat.isGroup} name={selectChat.name} large />
                    <div className="flex flex-col h-2/3 my-4 bg-[#151223] gap-y-4 px-2">
                        {messageList.map((message, i) => {
                            return (
                                <div className="flex flex-row items-center gap-x-2" key={i}>
                                    <img src={defaulProfile} className={`w-8 ${message.sender == "asia" ? "collapse" : "visible"}`} />
                                    <div className={message.sender === "asia" ? "text-end text-xl text-white font-bold bg-[#4E38A1] rounded-lg w-full pt-2 pb-3 px-8" :
                                        "text-xl text-start text-[#6D6B7C] font-bold bg-[#19182D] rounded-lg w-full pt-2 pb-3 px-8"}>{message.text}</div>
                                    <img src={defaulProfile} className="w-8 collapse" />
                                </div>
                            )
                        })}
                    </div>
                </div>}
            </div>

        </>
    )
}



export default ChatRoomPage;