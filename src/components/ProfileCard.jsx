import React from "react";
import defaultProfile from "../assets/DefaultProfile.svg"
import groupProfile from "../assets/GroupProfile.svg"
import online from "../assets/Online.svg"
import offline from "../assets/Offline.svg"
import notiLogo from "../assets/Noti.svg"
const ProfileCard = ({ h, group, name = "Demo", status = 1, onClick, large, profile, noti }) => {
    // if (name == "asia") console.log(noti);
    return (
        <>
            <div className={`${large ? "h-20" : "h-12"} relative flex flex-row ${large ? "items-start" : "items-center"} gap-x-${large ? 8 : 4}  font-montserrat min-w-fit cursor-pointer`} onClick={onClick}>
                <div className="relative">
                    {group ? <img src={groupProfile} className={`${large ? "h-[64px]" : "h-[32px]"}`} /> : <img src={defaultProfile} className={`h-[${large ? "64px" : "32px"}]`} />}
                    {!group && !profile && <img src={status == 1 ? online : offline} className={large ? "w-4 absolute bottom-1 right-0" : "absolute bottom-0 right-0"} />}
                </div>
                {/* {group ? <img src={groupProfile} className={`${large ? "h-[64px]" : "h-[32px]"}`} /> : <img src={defaultProfile} className={`h-[${large ? "64px" : "32px"}]`} />} */}
                <div className={`text-white font-bold min-w-fit ${large ? "text-3xl pt-2" : "text-base"}`}>{name}</div>
                {noti && <img src={notiLogo} className="absolute right-2" />}
            </div>
        </>
    )
}
export default ProfileCard;