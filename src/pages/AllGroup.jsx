import React from "react";
import { useNavigate } from "react-router-dom";
import createGroup from "../assets/CreateGroup.svg"
import Navbar from "../components/Navbar";

const groupList = ["SE II", "Comp network", "NN", "OS", "PM2"]

const AllGroupPage = () => {

    const navigate = useNavigate();

    const createGroupHandler = () => {
        navigate("/create-group");
    }

    return (
        <>
            <Navbar />
            <div className="px-24 bg-[#151223] mt-[10vh] h-[90vh] flex flex-col">
                <div className="flex flex-row items-center justify-between pt-4 pl-16 my-4">
                    <div className="font-montserrat font-bold text-5xl text-white">All groups</div>
                    <img src={createGroup} className="hover:cursor-pointer" onClick={createGroupHandler} />
                </div>
                <div className="font-montserrat font-bold text-[#6D6B7C] pl-16 my-4 mb-16">List of Groups that you are not joined yet. Click to join</div>
                <div className="flex flex-col gap-y-3 max-h-3/4">
                    {
                        groupList.map((group, i) => {
                            return <div className="pl-8 font-montserrat font-bold text-white w-full text-xl bg-[#19182D] rounded-lg py-3">{group}</div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default AllGroupPage;