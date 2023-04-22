import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import createGroup from "../assets/CreateGroup.svg"
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { apiClient } from "../utils/apiClient";

const AllGroupPage = () => {
    const [groupList, setGroupList] = useState(["GG"]);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchAllGroup = async () => {
        const res = await apiClient.get("/chat/groupChat");
        setGroupList(res.data);
    }

    useEffect(() => {
        fetchAllGroup();
    }, [])

    const createGroupHandler = () => {
        navigate("/create-group");
    }

    const joinGroupHandler = async (group) => {
        let joinflag = 0;
        group.users.forEach(user => {
            if (user.username === authCtx.userInfo.username) {
                console.log("Already join!");
                joinflag = 1;

            }
        });
        if (joinflag) return;
        try {
            const chatId = group._id;
            const data = JSON.stringify({ chatId });
            const res = await apiClient.put("/chat/join", data, {
                headers: { "Content-Type": "Application/json" }
            });
            navigate("/chatroom");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Navbar />
            <div className="px-24 bg-[#151223] mt-[10vh] h-[90vh] flex flex-col">
                <div className="flex flex-row items-center justify-between pt-4 pl-16 my-4">
                    <div className="font-montserrat font-bold text-5xl text-white">All groups</div>
                    <img src={createGroup} className="hover:cursor-pointer" onClick={createGroupHandler} />
                </div>
                <div className="font-montserrat font-bold text-[#6D6B7C] pl-16 my-4 mb-16">List of all Groups. Click to join</div>
                <div className="flex flex-col gap-y-3 max-h-3/4">
                    {
                        groupList.map((group, i) => {
                            console.log(group);
                            return <div className="pl-8 font-montserrat font-bold text-white w-full text-xl bg-[#19182D] rounded-lg py-3 hover:cursor-pointer" key={i} onClick={joinGroupHandler.bind(null, group)}>{group.chatName}</div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default AllGroupPage;