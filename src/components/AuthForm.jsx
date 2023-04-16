import React from "react";
import { useForm } from "../hooks/form-hook";
import Input from "./Input.jsx";
import { VALIDATOR_REQUIRE, VALIDATOR_MATCH } from "./Validate";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import uploadButton from "../assets/UploadButton.svg"

const AuthForm = ({ inputs, submitText, navigateText1, navigateText2, to, title, file }) => {
    let initState = {};
    inputs.forEach(input => {
        initState[input.id] = { value: "", isValid: false };
    });
    const [formState, inputHandler] = useForm(initState);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const navigate = useNavigate();
    const navigateHandler = (path) => {
        navigate(path);
    }
    const profileChangeHandler = (event) => {
        event.preventDefault();
        console.log(event.target.files[0].name);
        setSelectedProfile(event.target.files[0]);
    };
    return (
        <>
            <div className=" flex flex-col pt-8 pb-2 w-[30%] rounded-lg bg-white gap-y-2 items-center">
                <div className="font-montserrat text-4xl font-bold text-[#4E38A1] mb-2">{title}</div>
                {inputs.map((input, i) => {
                    return <Input type={input.type} id={input.id} placeholder={input.placeholder} onInput={inputHandler} validator={input.id == "cfpw" ? [VALIDATOR_MATCH(formState.inputs.pw.value)] : [VALIDATOR_REQUIRE()]} required key={i} />
                })}
                {file &&
                    <>
                        <label htmlFor="profile" className="hover:cursor-pointer bg-[#2C3BC7] text-white rounded-lg w-[40%] py-2 font-montserrat text-center font-bold text-xl mt-2 flex flex-row justify-center gap-x-4">
                            <img src={uploadButton} className="w-4" />
                            <div>upload</div>
                        </label>
                        <div className="font-montserrat">{selectedProfile ? `You have upload ${selectedProfile.name}` : "Upload your profile here"}</div>
                        <input type="file" accept="image/png,image/jpeg" className="hidden" id="profile" onChange={profileChangeHandler} />
                    </>
                }
                <button className="disabled:opacity-50 disabled:cursor-no-drop text-white font-bold font-montserrat bg-[#4E38A1] w-[50%] rounded-lg py-2 text-xl mt-4 mb-2" disabled={!formState.isValid}>{submitText}</button>

                <div className="flex flex-row justify-center font-montserrat gap-x-2 font-bold">
                    <div className="text-[#909090]">{navigateText1}</div>
                    <div className="text-[#4E38A1] hover:cursor-pointer hover:text-black" onClick={navigateHandler.bind(null, to)}>{navigateText2}</div>
                </div>

            </div>
        </>
    );
};

export default AuthForm;