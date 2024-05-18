"use client"

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported

const VerifiedAarti = () => {
  const [donations, setDonations] = useState([]); // Array to store fetched donations
  const [totalAmount, setTotalAmount] = useState(0); // State for total donation amount
  const [totalDonationsCount, setTotalDonationsCount] = useState(0); // State for total donations count

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "verifiedAarti"); // Reference the donations collection
        const q = query(donationsRef); // Create a basic query to fetch all donations

        const donationSnapshot = await getDocs(q);

        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread operator to include all donation data fields
          verified: true, // Add a verified property to each donation object (initially false)
        }));

        setDonations(donationData);

        // Calculate and set total amount and count (consider filtering for verified donations)
        const totalAmountVerified = donationData.filter((donation) => donation.verified).reduce((acc, donation) => acc + parseInt(donation.donationAmount), 0);
        const totalDonationsVerified = donationData.filter((donation) => donation.verified).length;
        setTotalAmount(totalAmountVerified);
        setTotalDonationsCount(totalDonationsVerified); // Update with verified count

      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations(); // Call the function on component mount
  }, []);

  return (
    <Layout>
    <div>
    <nav className="h-[10vh] flex sm:flex-row flex-col justify-between mt-5 items-center gap-x-3">
          <p className="text-xl sm:block hidden">Verified Aarti</p>
          <div className="flex sm:justify-normal justify-center items-center gap-x-3">
            <p className="mx-3 text-xl">Total: ₹{totalAmount}</p>
            <p className="mx-3">Donations : {totalDonationsCount}</p>
          </div>
        </nav>
      {donations.length > 0 ? (
        <ul className="w-full grid sm:grid-cols-3 sm:gap-2 justify-center">
          {donations.map((donation) => (
            <li key={donation.id} className="rounded-xl m-3 mb-0 sm:w-[70vw] w-[90vw] h-fit border-2 border-gray-100 bg-white">
               <div className="flex items-start gap-4 p-4 sm:p-4 lg:p-8">
    <a href={donation.imageUrl} target="_blank" className="block shrink-0">
      <img
        alt=""
        src={donation.imageUrl}
        className="  size-28 rounded-lg object-cover"
      />
    </a>

    <div>
      <div>
      <h3 className="font-medium sm:text-lg">
        Name : {donation.name}
      </h3>
      <h3 className="font-medium sm:text-lg">
        Father Name : {donation.fatherName}
      </h3>
      <h3 className="font-medium sm:text-lg">
        Amount: {donation.donationAmount}
      </h3>
      <h3 className="font-medium sm:text-lg">
        Date: {donation.date}
      </h3>
      </div>
    </div>
  </div>

  <div className="flex justify-end">
    <strong
      className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-green-600 px-3 py-1.5 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>

      <span className="text-[10px] font-medium sm:text-xs">Verified</span>
    </strong>
  </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No verified donations yet.</p>
      )}
    </div>
    </Layout>
  );
};

export default VerifiedAarti;