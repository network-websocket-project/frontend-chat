import React from "react";
import { useForm } from "../hooks/form-hook";
import Input from "./Input.jsx";
import { VALIDATOR_REQUIRE } from "./Validate";
const AuthForm = ({ inputs }) => {
    let initState = {};
    inputs.forEach(input => {
        initState[input.id] = { value: "", isValid: false };
    });
    const [formState, inputHandler] = useForm(initState);
    return (
        <>
            <div className=" flex flex-col py-4">
                {inputs.map((input, i) => {
                    return <Input type="text" id={input.id} placeholder={input.placeholder} onInput={inputHandler} validator={[VALIDATOR_REQUIRE()]} required key={i} />
                })}
            </div>
        </>
    );
};

export default AuthForm;