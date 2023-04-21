import React, { useContext } from "react";
import logo from "../assets/Logo.svg"
import ProfileCard from "./ProfileCard";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const groupHandler = () => {
        navigate("/all-group");
    }
    return (
        <>
            {authCtx.userInfo && <div className="fixed top-0 left-0 h-[10vh] bg-[#151223] w-full flex flex-row text-white items-center justify-between pl-6 pr-24 border-b-4 border-[#1F1C32]">
                <img className="w-48 cursor-pointer" src={logo} onClick={navigate.bind(null, "/chatroom")} />
                <div className="flex flex-row items-center font-montserrat min-w-fit gap-x-8">
                    <div className="font-bold min-w-fit hover:cursor-pointer" onClick={groupHandler}>All Groups</div>
                    <ProfileCard h="20" name={authCtx.userInfo.nickname} onClick={navigate.bind(null, "/edit-profile")} />
                </div>
            </div>}
        </>
    )
}

export default Navbar;