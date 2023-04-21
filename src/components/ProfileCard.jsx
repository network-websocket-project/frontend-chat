import React from "react";
import defaultProfile from "../assets/DefaultProfile.svg"
import groupProfile from "../assets/GroupProfile.svg"
const ProfileCard = ({ h, group, name = "Demo", status, onClick, large }) => {
    return (
        <>
            <div className={`${large ? "h-20" : "h-12"} flex flex-row ${large ? "items-start" : "items-center"} gap-x-${large ? 8 : 4}  font-montserrat min-w-fit cursor-pointer`} onClick={onClick}>
                {group ? <img src={groupProfile} className={`${large ? "h-[64px]" : "h-[32px]"}`} /> : <img src={defaultProfile} className={`h-[${large ? "64px" : "32px"}]`} />}
                <div className={`text-white font-bold min-w-fit ${large ? "text-3xl pt-2" : "text-base"}`}>{name} <span className={`${large ? "text-3xl text-green-500" : "text-xl text-[#909090]"}`}>•</span></div>
            </div>
        </>
    )
}
export default ProfileCard;