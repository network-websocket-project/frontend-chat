import React, { useContext } from "react";
import logo from "../assets/Logo.svg"
import ProfileCard from "./ProfileCard";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import logout from "../assets/Logout.svg"
import { SocketContext } from "../contexts/SocketContext";

const Navbar = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const socketCtx = useContext(SocketContext);
    const groupHandler = () => {
        navigate("/all-group");
    }
    const logoutHandler = () => {
        socketCtx.socket.emit("custom disconnect");
        authCtx.logout();
        navigate("/login");
    }
    return (
        <>
            {authCtx.userInfo && <div className="fixed top-0 left-0 h-[10vh] bg-[#151223] w-full flex flex-row text-white items-center justify-between pl-6 pr-24 border-b-4 border-[#1F1C32]">
                <img className="w-48 cursor-pointer" src={logo} onClick={navigate.bind(null, "/chatroom")} />
                <div className="flex flex-row items-center font-montserrat min-w-fit gap-x-8">
                    <div className="font-bold min-w-fit hover:cursor-pointer" onClick={groupHandler}>All Groups</div>
                    <ProfileCard h="20" name={authCtx.userInfo.nickname} onClick={navigate.bind(null, "/edit-profile")} avatar={authCtx.userInfo.avatar} profile />
                    <img className="w-8 cursor-pointer" src={logout} onClick={logoutHandler} />
                </div>
            </div>}
        </>
    )
}

export default Navbar;