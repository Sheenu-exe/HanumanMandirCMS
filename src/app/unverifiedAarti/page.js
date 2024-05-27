"use client"

import { useState, useEffect } from "react";
import { collection, getDocs, query, doc, updateDoc, deleteDoc, addDoc } from "@firebase/firestore";
import { db } from "../API/firebase.config";
import Layout from "@/components/Layout";
import { GoCheckCircle } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

const UnverifiedAarti = () => {
  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDonationsCount, setTotalDonationsCount] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "unverifiedAarti");
        const q = query(donationsRef);
        const donationSnapshot = await getDocs(q);
        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          verified: false,
        }));
        setDonations(donationData);
        const total = donationData.reduce((acc, donation) => acc + parseInt(donation.amount), 0);
        setTotalAmount(total);
        setTotalDonationsCount(donationData.length);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };
    fetchDonations();
  }, []);

  const transferToVerified = async (donation) => {
    try {
      const verifiedDonationsRef = collection(db, "verifiedAarti");
      const addedDocRef = await addDoc(verifiedDonationsRef, donation);
      const donationRef = doc(db, "unverifiedAarti", donation.id);
      await deleteDoc(donationRef);
      setDonations((prevDonations) => prevDonations.filter((d) => d.id !== donation.id));
    } catch (error) {
      console.error("Error transferring donation to verified:", error);
    }
  };

  const sendSMS = async (phoneNumber, Name, amount) => {
    console.log("Phone number to send SMS:", phoneNumber);
    const apiKey = "Tq58WlkcY26wRAVrDniLaKgUudG9myv7NIsQejEZ3C0f1HOhtoQTKj436rehuAbPDFf9ZRix8LYNoCyn";
    if (!apiKey) {
      console.error("Missing FAST2SMS_API_KEY environment variable");
      return;
    }
    
    const route = 'q';
    const message = `${Name}, ₹${amount} Received By Gokul Yuva Sangathan.`;
    const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    url.searchParams.set('authorization', apiKey);
    url.searchParams.set('route', route);
    url.searchParams.set('message', message);
    url.searchParams.set('flash', '0');
    url.searchParams.set('numbers', phoneNumber);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.return === true) {
        console.log('SMS sent successfully:', data);
        // Optionally update the donation object to mark SMS as sent
      } else {
        console.error('Error sending SMS:', data);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  const handleVerify = async (donationId) => {
    try {
      const donationRef = doc(db, "unverifiedAarti", donationId);
      const donationSnapshot = await getDoc(donationRef);
      const donation = { id: donationSnapshot.id, ...donationSnapshot.data() };
      if (donation) {
        await transferToVerified(donation);
        setTotalAmount((prevTotal) => prevTotal - parseInt(donation.amount));
        setTotalDonationsCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error verifying donation:", error);
    }
  };

  const handleDelete = async (donationId) => {
    try {
      const donationRef = doc(db, "unverifiedAarti", donationId);
      await deleteDoc(donationRef);
      const updatedDonations = donations.filter((donation) => donation.id !== donationId);
      setDonations(updatedDonations);
      const remainingDonations = updatedDonations.filter((donation) => !donation.verified);
      const updatedTotalAmount = remainingDonations.reduce(
        (acc, donation) => acc + parseInt(donation.donationAmount),
        0
      );
      setTotalAmount(updatedTotalAmount);
      setTotalDonationsCount(updatedDonations.length);
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  return (
    <Layout>
      <div>
        <nav className="h-[10vh] hidden w-full sm:flex sm:flex-row flex-col justify-between mt-5 items-center gap-x-3">
          <p className="text-xl sm:block hidden">Unverified Aarti</p>
          <div className="flex sm:justify-normal justify-center items-center gap-x-3">
            <p className="mx-3 text-xl">Total: ₹{totalAmount}</p>
            <p className="mx-3">Donations : {totalDonationsCount}</p>
          </div>
        </nav>
        {donations.length > 0 ? (
          <ul className="w-full grid sm:grid-cols-3 sm:gap-2 justify-center">
            {donations.map((donation) => (
              <li key={donation.id} className="sm:max-w-xs w-[95%] m-3 mb-0 p-6 rounded-md shadow-md dark:bg-gray-9">
                <img src={donation.imageUrl} alt="donationamount" className="object-cover object-center w-full h-[40vh] rounded-md dark:bg-gray-500" />
                <div className="mt-6 mb-2">
                  <div className="flex w-full flex-col gap-y-1 justify-between">
                    <span className="block font-medium tracki uppercase">{donation.name}</span>
                    <span className="block font-medium tracki uppercase">{donation.fatherName}</span>
                    <span className="block font-medium tracki uppercase">{donation.date}</span>
                    <h2 className="block font-medium tracki uppercase">₹ {donation.donationAmount}/-</h2>
                  </div>
                  <div className="flex justify-around w-full">
                    {donation.verified ? (
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md disabled:opacity-50">Verified</button>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-green-200 hover:bg-green-400 text-2xl py-1 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg  px-5 text-green-950 text-center dark:focus:ring-green-800"
                          onClick={() => handleVerify(donation.id)}
                          disabled={donation.verified} 
                        >
                          <GoCheckCircle />
                        </button>
                        <button
                          className="bg-green-200 hover:bg-green-400 text-lg py-1 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg px-5 text-green-950 text-center dark:focus:ring-green-800"
                          onClick={() => sendSMS(donation.mobileNumber, donation.name, donation.donationAmount)}
                        >
                          Send Msg
                        </button>
                        <button
                          className="text-red-900 bg-red-200 hover:bg-red-400 text-2xl py-1 focus:ring-4 focus:outline-none focus:ring-red-300 font-lg font-medium rounded-lg px-5 text-center dark:focus:ring-red-800"
                          onClick={() => handleDelete(donation.id)}
                        >
                          <TiDeleteOutline />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg font-medium">No donations found yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default UnverifiedAarti;
