"use client"
import { useState, useEffect } from "react";
import { collection, getDocs, query, doc, updateDoc, deleteDoc } from "@firebase/firestore";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported
import Layout from "@/components/Layout";
import { getDoc } from "@firebase/firestore";
import { addDoc } from "@firebase/firestore";
import { GoCheckCircle } from "react-icons/go"; 
import { TiDeleteOutline } from "react-icons/ti";

const DonationList = () => {
  const [donations, setDonations] = useState([]); // Array to store fetched donations
  const [totalAmount, setTotalAmount] = useState(0); // State for total donation amount
  const [totalDonationsCount, setTotalDonationsCount] = useState(0); // State for total donations count

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "donations"); // Reference the donations collection
        const q = query(donationsRef); // Create a basic query to fetch all donations

        const donationSnapshot = await getDocs(q);

        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread operator to include all donation data fields
          verified: false, // Add a verified property to each donation object (initially false)
        }));

        setDonations(donationData);

        // Calculate and set total amount and count
        const total = donationData.reduce((acc, donation) => acc + parseInt(donation.amount), 0);
        setTotalAmount(total);
        setTotalDonationsCount(donationData.length);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations(); // Call the function on component mount
  }, []); // Empty dependency array to run only once on mount

  const transferToVerified = async (donation) => {
    try {
      // Create a reference to the verifedDonations collection
      const verifiedDonationsRef = collection(db, "verifiedDonations");

      // Add the donation data to the verifedDonations collection
      const addedDocRef = await addDoc(verifiedDonationsRef, donation);
      console.log("Donation transferred to verifiedDonations:", addedDocRef.id); // Optional for logging

      // After successful transfer, delete the donation from both collections
      const donationRef = doc(db, "donations", donation.id);
      await deleteDoc(donationRef);
      console.log("Donation deleted from donations:", donation.id); // Optional for logging

      const verifiedDonationRef = doc(db, "verifiedDonations", addedDocRef.id);
      await deleteDoc(verifiedDonationRef);

    } catch (error) {
      console.error("Error transferring donation to verified:", error);
      // Handle transfer error (e.g., display notification)
    }
  };

  const handleVerify = async (donationId) => {
    try {
      const donationRef = doc(db, "donations", donationId);

      // Get the entire donation object before updating
      const donationSnapshot = await getDoc(donationRef);
      const donation = donationSnapshot.data();

      // Optional: Update the "verified" property locally
      donation.verified = true;

      // Transfer the donation data to the verifiedDonations collection and delete it after processing
      await transferToVerified(donation);

      // Update local state to remove deleted donation
      const updatedDonations = donations.filter((d) => d.id !== donation.id);
      setDonations(updatedDonations);
      try {
        const donationRef = doc(db, "donations", donationId);
        await deleteDoc(donationRef);
  
        // Update local state to remove deleted donation
        const updatedDonations = donations.filter((donation) => donation.id !== donationId);
        setDonations(updatedDonations);
  
        // Update total amount and count if necessary (based on donation amount)
        const remainingDonations = updatedDonations.filter((donation) => !donation.verified);
        const updatedTotalAmount = remainingDonations.reduce(
          (acc, donation) => acc + parseInt(donation.amount),
          0
        );
        setTotalAmount(updatedTotalAmount);
        setTotalDonationsCount(updatedDonations.length);
      } catch (error) {
        console.error("Error deleting donation:", error);
        // Handle deletion error (e.g., display notification)
      }
    } catch (error) {
      console.error("Error verifying donation:", error);
      // Handle verification error (e.g., display notification)
    }
  };

  const handleDelete = async (donationId) => {
    try {
      const donationRef = doc(db, "donations", donationId);
      await deleteDoc(donationRef);

      // Update local state to remove deleted donation
      const updatedDonations = donations.filter((donation) => donation.id !== donationId);
      setDonations(updatedDonations);

      // Update total amount and count if necessary (based on donation amount)
      const remainingDonations = updatedDonations.filter((donation) => !donation.verified);
      const updatedTotalAmount = remainingDonations.reduce(
        (acc, donation) => acc + parseInt(donation.amount),
        0
      );
      setTotalAmount(updatedTotalAmount);
      setTotalDonationsCount(updatedDonations.length);
    } catch (error) {
      console.error("Error deleting donation:", error);
      // Handle deletion error (e.g., display notification)
    }
  };

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
              <li key={donation.id} className="sm:max-w-xs w-[95%] m-3 mb-0 p-6 rounded-md shadow-md dark:bg-gray-9">

<img src={donation.imageUrl} alt="" className="object-cover object-center w-full h-[40vh] rounded-md dark:bg-gray-500" />
        <div className="mt-6 mb-2">
          <span className="block text-xs font-medium tracki uppercase dark:text-purple-400">{donation.name}</span>
          <h2 className="text-xl font-semibold tracki">₹ {donation.amount}/-</h2>
          <div className="flex justify-end">
            {donation.verified ? (
              <button className="px-3 py-1 bg-green-500 text-white rounded-md disabled:opacity-50">Verified</button>
            ) : (
              <>
                <div className="flex justify-center space-x-2">
                    <button
                      className=" bg-green-200 hover:bg-green-400 text-xl focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 text-green-950 py-2.5 text-center dark:focus:ring-green-800"
                      onClick={() => handleVerify(donation.id)}
                      disabled={donation.verified} // Disable verify button if already verified
                    >
                      {donation.verified ? <GoCheckCircle /> :<GoCheckCircle/>}
                    </button>
                    <button
                      className="text-red-900 bg-red-200 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center"
                      onClick={() => handleDelete(donation.id)}
                    >
                      <TiDeleteOutline/> 
                    </button>
                  </div>
              </>
            )}
          </div>
        </div>
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