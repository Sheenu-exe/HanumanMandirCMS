"use client"

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported

const VerifiedDonation = () => {
  const [donations, setDonations] = useState([]); // Array to store fetched donations
  const [totalAmount, setTotalAmount] = useState(0); // State for total donation amount
  const [totalDonationsCount, setTotalDonationsCount] = useState(0); // State for total donations count

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "verifiedDonations"); // Reference the donations collection
        const q = query(donationsRef); // Create a basic query to fetch all donations

        const donationSnapshot = await getDocs(q);

        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread operator to include all donation data fields
          verified: true, // Add a verified property to each donation object (initially false)
        }));

        setDonations(donationData);

        // Calculate and set total amount and count (consider filtering for verified donations)
        const totalAmountVerified = donationData.filter((donation) => donation.verified).reduce((acc, donation) => acc + parseInt(donation.amount), 0);
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
          <p className="text-xl sm:block hidden">श्री गोकुलवाड़ी हनुमानजी मंदिर</p>
          <div className="flex sm:justify-normal justify-center items-center gap-x-3">
            <p className="mx-3 text-xl">Total: ₹{totalAmount}</p>
            <p className="mx-3">Donations : {totalDonationsCount}</p>
          </div>
        </nav>
      {donations.length > 0 ? (
        <ul className="w-full grid sm:grid-cols-3 sm:gap-2 justify-center">
          {donations.map((donation) => (
            <li key={donation.id} className="sm:max-w-xs w-[95%] m-3 mb-0 p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50">
              <img src={donation.imageUrl} alt="" className="object-cover object-center w-full h-[40vh] rounded-md dark:bg-gray-500" />
              <div className="mt-6 mb-2">
                <span className="block text-xs font-medium tracki uppercase dark:text-purple-400">{donation.name}</span>
                <h2 className="text-xl font-semibold tracki">₹ {donation.amount}/-</h2>
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

export default VerifiedDonation;