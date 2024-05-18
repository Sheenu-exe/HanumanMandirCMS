"use client"
import { useEffect, useState } from "react";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported
import { collection, getDocs, query, deleteDoc, doc } from "@firebase/firestore";
import Layout from "@/components/Layout";
import { CgLink } from "react-icons/cg";
import { GoCheckCircle } from "react-icons/go"; 
import { TiDeleteOutline } from "react-icons/ti";
import { updateDoc } from "@firebase/firestore";
import { addDoc } from "@firebase/firestore";
const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const membersRef = collection(db, "unverifiedMembers"); // Adjust collection name as needed
        const q = query(membersRef); // Optional: You can create a query here to filter data
        const querySnapshot = await getDocs(q);

        const fetchedMembers = [];
        querySnapshot.forEach((doc) => {
          fetchedMembers.push({ id: doc.id, ...doc.data() });
        });

        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("An error occurred. Please try again later.");
      } finally {
        setIsLoading(isLoading); // Corrected typo: set final state
      }
    };

    fetchMembers();
  }, []); // Empty dependency array: fetch data only once on component mount

  const handleVerify = async (memberId) => {
    try {
      const memberRef = doc(db, "members", memberId); // Reference the member document

      // Update the member's "verified" property (assuming it exists)
      await updateDoc(memberRef, { verified: true });

      // Optionally move the member data to a "verifiedMembers" collection
      const verifiedMemberData = { ...members.find((m) => m.id === memberId) };
      await addDoc(collection(db, "verifiedMembers"), verifiedMemberData); // Adjust collection name and data structure as needed

      // Remove the member from the "members" collection
      await deleteDoc(memberRef);

      // Update the local state to reflect the changes
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (err) {
      console.error("Error verifying member:", err);
      alert("An error occurred during verification. Please try again.");
    }
  };

  const handleDelete = async (memberId) => {
    try {
      const memberRef = doc(db, "unverifiedMembers", memberId);
      await deleteDoc(memberRef);

      // Update the local state to reflect the deletion
      setMembers(members.filter((member) => member.id !== memberId));
      // Optional: Show a success message (e.g., using a toast library)
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("An error occurred during deletion. Please try again.");
    }
  };

  return (
    <Layout>
      <header className="h-[10vh] flex items-center"><p className="text-3xl mx-3 font-bold">Members Under Verification</p></header>
      <div>
        {isLoading ? (
          <p>Loading members...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="flex flex-wrap mx-3 gap-2 justify-center sm:justify-normal">
            {members.map((member) => (
              <li key={member.id} className="flex flex-col justify-center sm:w-[20vw] p-6 shadow-md rounded-xl sm:px-12 dark:bg-zinc-200 dark:text-gray-900">
                <img src={member.profilePicUrl} alt="" className="w-32 object-cover h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
                <div className="space-y-4 text-center ">
                  <div className="my-2 space-y-1">
                    <h2 className="text-xl font-semibold text-wrap sm:text-2xl">{member.Name}</h2>
                    <p className="px-5 text-xs sm:text-base">{member.fatherName}</p>
                    <p className="px-5 text-xs sm:text-base">{member.number}</p>
                    <a target="_blank" href={member.paymentScreenshotUrl} className="underline flex items-center justify-center"><CgLink/>Payment</a>
                    <a target="_blank" href={member.aadhaarPicUrl} className="underline flex items-center justify-center"><CgLink/>Aadhaar Link</a>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      className=" bg-green-200 hover:bg-green-400 text-xl focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 text-green-950 py-2.5 text-center dark:focus:ring-green-800"
                      onClick={() => handleVerify(member.id)}
                      disabled={member.verified} // Disable verify button if already verified
                    >
                      {member.verified ? <GoCheckCircle /> :<GoCheckCircle/>}
                    </button>
                    <button
                      className="text-red-900 bg-red-200 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center"
                      onClick={() => handleDelete(member.id)}
                    >
                      <TiDeleteOutline/> 
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default MemberList;
