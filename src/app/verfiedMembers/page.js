"use client"

import { useEffect, useState } from "react";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported
import { collection, getDocs, query } from "@firebase/firestore"; 
import Layout from "@/components/Layout";

const VerifiedMembersList = () => {
  const [verifiedMembers, setVerifiedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerifiedMembers = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const verifiedMembersRef = collection(db, "verifiedMembers"); // Adjust collection name as needed
        const q = query(verifiedMembersRef); // Optional: You can create a query here to filter data
        const querySnapshot = await getDocs(q);

        const fetchedMembers = [];
        querySnapshot.forEach((doc) => {
          fetchedMembers.push({ id: doc.id, ...doc.data() });
        });

        setVerifiedMembers(fetchedMembers);
      } catch (err) {
        console.error("Error fetching verified members:", err);
        setError("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedMembers();
  }, []); // Empty dependency array: fetch data only once on component mount

  return (
    <Layout>
        <header className="h-[10vh] flex items-center"><p className="text-3xl mx-3 font-bold">Verified Members</p></header>
    <div>
      {isLoading ? (
        <p>Loading verified members...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {verifiedMembers.map((member) => (
            <li key={member.id} className="flex m-2 flex-col w-[20vw] p-6 shadow-md rounded-xl sm:px-12 dark:bg-zinc-200 dark:text-gray-900">
              <img src={member.profilePicUrl} alt="" className="w-32 object-cover h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
              <div className="mt-4 space-y-2 text-center">
                <h2 className="text-xl font-semibold text-wrap sm:text-2xl">{member.Name}</h2>
                <p className="px-5 text-xs sm:text-base">{member.number}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </Layout>
  );
};

export default VerifiedMembersList;
