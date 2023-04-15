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
            <input
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
        </>
    );
};

export default Input;
