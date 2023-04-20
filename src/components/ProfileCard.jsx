import React from "react";
import defaultProfile from "../assets/DefaultProfile.svg"
import groupProfile from "../assets/GroupProfile.svg"
const ProfileCard = ({ h, group, name = "Demo", status, onClick, large }) => {
    return (
        <>
            <div className={`h-${large ? 24 : 14} flex flex-row ${large ? "items-start" : "items-center"} gap-x-${large ? 8 : 4}  font-montserrat min-w-fit`} onClick={onClick}>
                {group ? <img src={groupProfile} className="h-2/3" /> : <img src={defaultProfile} className="h-2/3" />}
                <div className={`text-white font-bold min-w-fit ${large ? "text-3xl pt-2" : "text-base"}`}>{name} <span className={`${large ? "text-3xl text-green-500" : "text-xl text-[#909090]"}`}>•</span></div>
            </div>
        </>
    )
}
export default ProfileCard;