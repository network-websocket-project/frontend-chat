import React, { useReducer } from "react";
import { validate } from "./Validate.jsx";
import { useEffect } from "react";

function reducer(state, action) {
    if (action.type == "CHANGE") {
        return {
            ...state,
            value: action.value,
            isValid: validate(action.value, action.validator),
        };
    } else if (action.type == "TOUCH") {
        return {
            ...state,
            isFirstClick: true,
        };
    }
}

const Input = ({
    type,
    id,
    placeholder,
    validator,
    onInput,
    initialValue,
    initialValid,
}) => {
    const [state, dispatch] = useReducer(reducer, {
        value: initialValue || "",
        isValid: initialValid || false,
        isFirstClick: false,
    });
    const { value, isValid } = state;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    return (
        <>
            <div className="flex flex-col gap-y-0 w-full">
                <label htmrFor={id} className="ml-12 text-red-700 font-bold h-[20px]">*</label>
                <input className="self-center text-center font-montserrat font-bold border-2 border-[#909090] rounded-lg w-[80%] py-2 text-xl"
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={state.value}
                    onChange={(e) => {
                        dispatch({
                            type: "CHANGE",
                            value: e.target.value,
                            validator: validator,
                        });
                    }}
                    onFocus={() => {
                        dispatch({ type: "TOUCH" });
                    }}
                ></input>
            </div>
        </>
    );
};

export default Input;
