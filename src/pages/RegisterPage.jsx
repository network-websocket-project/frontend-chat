import React from 'react';
import logo from "../assets/Logo.svg"
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {

    const inputs = [{ type: "text", placeholder: "username", id: "uname2" }, { type: "password", placeholder: "password", id: "pw" }, { type: "password", placeholder: "confirm password", id: "cfpw" }, { type: "text", placeholder: "nickname", id: "nname" }]

    return (
        <>
            <div className="flex flex-col bg-[#151223] h-[100vh] justify-center items-center gap-y-10">
                <img className="w-80" src={logo} />
                <AuthForm inputs={inputs} title="Register" submitText="Register" navigateText1="Already have account?" navigateText2="Login" to="/login" file />
            </div>
        </>
    );
};

export default RegisterPage;