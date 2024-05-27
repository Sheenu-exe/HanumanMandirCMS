import Image from "next/image"
import bajrangbali from "../components/img/Hanumanji gys.webp"
import { CgMenuMotion } from "react-icons/cg";

export const Header = () => {
    return(
        <nav className="h-[10vh] w-full flex justify-between items-center">
            <div className="flex items-center">
            <Image className="sm:h-[8vh] mx-2 h-[5vh] w-[5vh] sm:w-[8vh] rounded-full" src={bajrangbali}/>
                <p className="sm:text-xl">श्री गोकुलवाड़ी हनुमानजी मंदिर</p>
                </div>
                <label htmlFor="my-drawer-2" className="btn mx-2 text-2xl drawer-button "><CgMenuMotion/></label>
            </nav>
    )
}