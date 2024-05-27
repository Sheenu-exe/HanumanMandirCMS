import Image from "next/image"
import Bajrangbali from "../components/img/Hanumanji gys.webp"
import Link from "next/link"
export const Sidebar = () => {
    return(
<div className="drawer z-10 sm:w-[20vw] w-0 sticky top-0 left-0 lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
  <div className="drawer-side">
    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay "></label> 
    <ul className="menu p-4 sm:w-full z-100 absolute min-h-full bg-base-200 items-center text-base-content">
    <Image  src={Bajrangbali} className="rounded-full h-[10vh] w-auto mb-5 object-cover"/>
      <li className="text-lg mb-5 font-bold w-full flex justify-center  items-center">
        
        श्री गोकुलवाड़ी हनुमानजी मंदिर</li>
        <li><Link href={"/"}>Home</Link></li>
        <li><Link href={"/GalleryForm"}>Add Photos</Link></li>
        <li><Link href={"/donations"}>Prasadi Verification</Link></li>
        <li><Link href={"/verifiedDonations"}>Verified Prasadi</Link></li>
        <li><Link href={"/unverifiedAarti"}>Aarti Verification</Link></li>
        <li><Link href={"/verifiedAarti"}>Verified Aarti</Link></li>
      <li><Link href={"/BlogsForm"}>Add Blogs</Link></li>
      <li><Link href={"/GalleryForm"}>Gallery</Link></li>
      <li><Link href={"/BlogLists"}>Blogs</Link></li>
      <li><Link href={"/MemberList"}>Members Verification</Link></li>
      <li><Link href={"/verfiedMembers"}>Verified Members</Link></li>
    </ul>
  
  </div>
</div>
    )
}