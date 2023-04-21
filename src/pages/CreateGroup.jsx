import React from "react";
import AuthForm from "../components/AuthForm";
import logo from "../assets/Logo.svg"
import line from "../assets/Line.svg"
const CreateGroupPage = () => {

    const inputs = [{ type: "text", placeholder: "group name", id: "gname" }]

    return (
        <>
            <div className="relative overflow-hidden z-[100]">
                <img src={line} className="absolute left-0 top-[550px]" />
                <img src={line} className="absolute left-0 top-[600px]" />
                <img src={line} className="absolute left-0 top-[650px]" />
                <img src={line} className="absolute right-0 bottom-[550px]" />
                <img src={line} className="absolute right-0 bottom-[600px]" />
                <img src={line} className="absolute right-0 bottom-[650px]" />
            </div>
            <div className="flex flex-col bg-[#151223] h-[100vh] justify-center items-center gap-y-10">
                <img className="w-80" src={logo} />
                <AuthForm inputs={inputs} submitText="Create" to="/chatroom" />
            </div>
        </>
    );
};
export default CreateGroupPage;