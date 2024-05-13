"use client"
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported
import Layout from "@/components/Layout";

const DonationList = () => {
    const [donations, setDonations] = useState([]); // Array to store fetched donations
    const [totalAmount, setTotalAmount] = useState(0); // State for total donation amount
    const [totalDonationsCount, setTotalDonationsCount] = useState(0); // State for total donations count
  
    useEffect(() => {
      const fetchDonations = async () => {
        try {
          // Create a query (optional for filtering/sorting)
          const donationsRef = collection(db, "donations"); // Reference the donations collection
          const q = query(donationsRef); // Create a basic query to fetch all donations
  
          // Get donation documents
          const donationSnapshot = await getDocs(q);
  
          const donationData = donationSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), // Spread operator to include all donation data fields
          }));
  
          setDonations(donationData);
  
          // Calculate and set total amount and count
          const total = donationData.reduce((acc, donation) => acc + donation.amount, 0);
          setTotalAmount(total);
          setTotalDonationsCount(donationData.length);
        } catch (error) {
          console.error("Error fetching donations:", error);
        }
      };
  
      fetchDonations(); // Call the function on component mount
    }, []); // Empty dependency array to run only once on mount
  
  return (
    <Layout>
    <div>
      <nav className="h-[10vh] flex sm:flex-row flex-col justify-between items-center gap-x-3"><p className="text-xl sm:block hidden">श्री गोकुलवाड़ी हनुमानजी मंदिर</p><div className="flex sm:justify-normal justify-center items-center gap-x-3"> <p className="mx-3"> Total: ₹{totalAmount}</p>  <p className="mx-3">Donations :  {totalDonationsCount} </p></div></nav>
      {donations.length > 0 ? (
        <ul className="w-full grid sm:grid-cols-3 sm:gap-2 justify-center">
          {donations.map((donation) => (
            <li key={donation.id} className="sm:max-w-xs m-3 mb-0 p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50">
                <img src={donation.imageUrl} alt="" className="object-cover object-center w-full rounded-md h-72 dark:bg-gray-500" />
              {/* Display donation details here, e.g., name, amount, date */}
              <div className="mt-6 mb-2">
		<span className="block text-xs font-medium tracki uppercase dark:text-purple-400">{donation.name}</span>
		<h2 className="text-xl font-semibold tracki">₹ {donation.amount}/-</h2>
	</div>
              {/* Add additional donation details if available */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No donations found.</p>
      )}
    </div>
    </Layout>
  );
};

export default DonationList;
