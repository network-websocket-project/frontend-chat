import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {

    const inputs = [{ type: "text", placeholder: "username", id: "uname" }, { type: "text", placeholder: "password", id: "pw" }]

    return (
        <>
            <div className="flex flex-col bg-[#151223]">
                <div className="text-white text-4xl">ChatApp</div>
                <AuthForm inputs={inputs} />
            </div>
        </>
    );
};
export default LoginPage