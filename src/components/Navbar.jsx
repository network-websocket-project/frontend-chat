import React from "react";
import logo from "../assets/Logo.svg"
import ProfileCard from "./ProfileCard";

const Navbar = () => {
    return (
        <>
            <div className="fixed top-0 left-0 h-[10vh] bg-[#151223] w-full flex flex-row text-white items-center justify-between pl-6 pr-8 border-b-4 border-[#1F1C32]">
                <img className="w-48" src={logo} />
                <div className="flex flex-row items-center font-montserrat min-w-fit gap-x-8">
                    <div className="font-bold min-w-fit">All Groups</div>
                    <ProfileCard h="20" />
                </div>
            </div>
        </>
    )
}

export default Navbar;