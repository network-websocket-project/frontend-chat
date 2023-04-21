import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import logo from "../assets/Logo.svg"
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    if (!authCtx.userInfo) return;
    const inputs = [{ type: "text", placeholder: "nickname", id: "nname", initialValue: authCtx.userInfo.nickname, initialValid: true }]

    return (
        <>
            <div className="flex flex-col bg-[#151223] h-[100vh] justify-center items-center gap-y-10">
                <img className="w-80 cursor-pointer" src={logo} onClick={navigate.bind(null, "/chatroom")} />
                <AuthForm inputs={inputs} submitText="Edit" title="Edit Profile" file preview back />
            </div>
        </>
    )
}

export default EditProfilePage;