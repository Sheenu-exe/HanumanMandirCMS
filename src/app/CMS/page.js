"use client"

import { useState, useEffect } from "react";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../API/firebase.config";


import Layout from "@/components/Layout"
const CMS = () => {
  const [donations, setDonations] = useState([]); 
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
        const total = donationData.reduce((acc, donation) => acc + parseInt(donation.amount), 0);
        setTotalAmount(total);
        setTotalDonationsCount(donationData.length);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations(); // Call the function on component mount
  }, []); // Empty dependency array to run only once on mount

    return(
      <Layout>
        <div className="h-[100vh] w-full flex flex-col">
            <div className="flex gap-2 h-fit sm:mt-6 justify-around w-full sm:items-[none] items-center sm:flex-row flex-col">
              <p className="text-left ml-4 w-full text-3xl">Stats</p>
            <article className="flex sm:w-[30%] w-[95%] h-fit justify-between  rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Members</p>

    <p className="text-2xl font-medium text-gray-900">64</p>
  </div>
</article>
<article className="flex sm:w-[30%] w-[95%] h-fit justify-between rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Collected Donation</p>

    <p className="text-2xl font-medium text-gray-900"><p>₹{totalAmount}</p></p>
  </div>


</article>
<article className="flex h-fit sm:w-[30%] w-[95%] justify-between rounded-lg border border-gray-100 bg-white p-6">
  <div>
    <p className="text-sm text-gray-500">Aarti Slots</p>

    <p className="text-2xl font-medium text-gray-900">5</p>
  </div>


</article>
</div>
<div className="w-full h-full flex justify-center items-center">
    <div className="w-[97.5%] rounded-lg border gap-y-2 border-gray-100 h-[90%] flex sm:flex-row flex-col justify-center items-center gap-x-7">
    <div class="sm:w-[45%] w-[95%]  h-[55%] flex flex-col rounded-lg bg-gray-200">
        <p className="text-xl m-3">आगामी आरती:</p>
        <div className="flex w-full">
        <div className="w-full mx-3 flex flex-col">
            <p className="text-lg">मंगलवार</p>
            <p className="text-sm">सुरेशजी पुखराजजी</p>
            </div>
        <div className="w-full mx-3 flex flex-col">
            <p className="text-lg">शनिवार</p>
            <p className="text-sm">भंवरलालजी पुखराजजी</p>
            </div>
        </div>
    </div>
  <div className="sm:w-[45%] w-[95%] h-[55%]  rounded-lg bg-gray-200"></div>
  <div className="sm:w-[45%] w-[95%] h-[55%] rounded-lg bg-gray-200"></div>
  <div className="text-sm w-[95%] h-[45%] rounded-lg bg-gray-200"></div>
    </div>
</div>
        </div>
        </Layout>
    )
}

export default CMS