import React, { useEffect } from "react";
import { useForm } from "../hooks/form-hook";
import Input from "./Input.jsx";
import { VALIDATOR_REQUIRE, VALIDATOR_MATCH } from "./Validate";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import uploadButton from "../assets/UploadButton.svg";
import { authClient } from "../utils/auth";
import { AuthContext } from "../contexts/AuthContext";
import { apiClient } from "../utils/apiClient";

const AuthForm = ({
  inputs,
  submitText,
  navigateText1,
  navigateText2,
  to,
  title,
  file,
  preview,
  back,
}) => {
  const authCtx = useContext(AuthContext);
  let initState = {};
  let initialFormValid = true;
  inputs.forEach((input) => {
    initialFormValid = initialFormValid && input.initialValid;
    initState[input.id] = {
      value: input.initialValue ? input.initialValue : "", isValid: input.initialValid ? input.initialValid : false
    };
  });
  const [formState, inputHandler, setFormData] = useForm(initState, initialFormValid);
  useEffect(() => {
    setFormData(initState, initialFormValid);
  }, [])
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const navigate = useNavigate();
  const navigateHandler = (path) => {
    navigate(path);
  };
  const profileChangeHandler = (event) => {
    event.preventDefault();
    console.log(event.target.files[0].name);
    setSelectedProfile(event.target.files[0]);
    setPreviewProfile(URL.createObjectURL(event.target.files[0]));
  };
  const submitAuth = async () => {
    let username, password, nickname, name, data, path;
    if (submitText === "Login") {
      path = "/user/login";
      username = formState.inputs.uname.value;
      password = formState.inputs.pw.value;
      data = JSON.stringify({ username, password });
    } else if (submitText === "Register") {
      path = "/user/register";
      username = formState.inputs.uname2.value;
      password = formState.inputs.pw.value;
      nickname = formState.inputs.nname.value;
      data = JSON.stringify({ username, password, nickname });
    } else if (submitText === "Edit") {
      path = "/user/edit";
      nickname = formState.inputs.nname.value;
    } else if (submitText === "Create") {
      path = "/chat/group";
      name = formState.inputs.gname.value;
      data = JSON.stringify({ name });
    }
    try {
      if (submitText === "Login" || submitText === "Register") {
        let res = await authClient.post(path, data, {
          headers: { "Content-Type": "application/json" },
        });
        if (submitText === "Register") {
          const formData = new FormData();
          formData.append("nickname", nickname);
          formData.append("avatar", selectedProfile);
          console.log(res);
          let res2 = await authClient.put("/user/edit", formData, {
            headers: { "Authorization": "Bearer " + res.data.token }
          });
          // console.log(res, res2);
        }
        authCtx.login(res.data);
        navigate('/chatroom');
      }
      else if (submitText === "Edit") {
        const formData = new FormData();
        formData.append("nickname", nickname);
        formData.append("avatar", selectedProfile);
        console.log(nickname);
        const res = await apiClient.put("/user/edit", formData);
        navigate("/chatroom");
        console.log(res);
      }
      else if (submitText === "Create") {
        console.log(data);
        const res = await apiClient.post(path, data, {
          headers: { "Content-Type": "application/json" },
        });
        navigate('/chatroom');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(formState);
  return (
    <>
      <div className=" flex flex-col pt-8 pb-2 w-[30%] rounded-lg bg-white gap-y-2 items-center">
        <div className="font-montserrat text-4xl font-bold text-[#4E38A1] mb-2">
          {title}
        </div>
        {inputs.map((input, i) => {
          return (
            <Input
              type={input.type}
              id={input.id}
              placeholder={input.placeholder}
              onInput={inputHandler}
              validator={
                input.id == "cfpw"
                  ? [VALIDATOR_MATCH(formState.inputs.pw.value)]
                  : [VALIDATOR_REQUIRE()]
              }
              required
              key={i}
              initialValue={input.initialValue ? input.initialValue : ""}
            />
          );
        })}
        {preview && (
          <>
            <img src={previewProfile} className="max-h-[300px] px-4" />
          </>
        )}
        {file && (
          <>
            <label
              htmlFor="profile"
              className="hover:cursor-pointer bg-[#2C3BC7] text-white rounded-lg w-[40%] py-2 font-montserrat text-center font-bold text-xl mt-2 flex flex-row justify-center gap-x-4"
            >
              <img src={uploadButton} className="w-4" />
              <div>upload</div>
            </label>
            <div className="font-montserrat">
              {selectedProfile
                ? `You have upload ${selectedProfile.name}`
                : "Upload your profile here"}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              id="profile"
              onChange={profileChangeHandler}
            />
          </>
        )}
        <div className="w-full flex flex-row gap-x-2 justify-center px-8">
          {back && <button
            className="disabled:opacity-50 disabled:cursor-no-drop text-white font-bold font-montserrat bg-[#909090] w-[50%] rounded-lg py-2 text-xl mt-4 mb-2"
            onClick={navigateHandler.bind(null, -1)}>
            back
          </button>
          }
          <button
            className="disabled:opacity-50 disabled:cursor-no-drop text-white font-bold font-montserrat bg-[#4E38A1] w-[50%] rounded-lg py-2 text-xl mt-4 mb-2"
            disabled={!formState.isValid}
            onClick={submitAuth}
          >
            {submitText}
          </button>
        </div>

        <div className="flex flex-row justify-center font-montserrat gap-x-2 font-bold">
          <div className="text-[#909090]">{navigateText1}</div>
          <div
            className="text-[#4E38A1] hover:cursor-pointer hover:text-black"
            onClick={navigateHandler.bind(null, to)}
          >
            {navigateText2}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
