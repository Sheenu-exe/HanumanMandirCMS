"use client"
import { useState, useEffect } from "react";
import { collection, getDocs, query, doc, updateDoc, deleteDoc } from "@firebase/firestore";
import { db } from "../API/firebase.config"; // Assuming firebase config is imported
import Layout from "@/components/Layout";
import { getDoc } from "@firebase/firestore";
import { addDoc } from "@firebase/firestore";
import { GoCheckCircle } from "react-icons/go";
import { TiDeleteOutline } from "react-icons/ti";

const unverifiedAarti = () => {
  const [donations, setDonations] = useState([]); // Array to store fetched donations
  const [totalAmount, setTotalAmount] = useState(0); // State for total donation amount
  const [totalDonationsCount, setTotalDonationsCount] = useState(0); // State for total donations count

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "unverifiedAarti"); // Reference the donations collection
        const q = query(donationsRef); // Create a basic query to fetch all donations

        const donationSnapshot = await getDocs(q);

        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
  }, []);

  const transferToVerified = async (donation) => {
    try {
      // Create a reference to the verifiedDonations collection
      const verifiedDonationsRef = collection(db, "verifiedAarti");

      // Add the donation data to the verifiedDonations collection
      const addedDocRef = await addDoc(verifiedDonationsRef, donation);
      console.log("Donation transferred to verifiedDonations:", addedDocRef.id); // Optional for logging

      // After successful transfer, delete the donation from the unverified collection
      const donationRef = doc(db, "unverifiedAarti", donation.id);
      await deleteDoc(donationRef);
      console.log("Donation deleted from unverifiedPrasadi:", donation.id); // Optional for logging

      // Remove the transferred donation from local state
      setDonations(prevDonations => prevDonations.filter(d => d.id !== donation.id));
    } catch (error) {
      console.error("Error transferring donation to verified:", error);
      // Handle transfer error (e.g., display notification)
    }
  };

  async function sendSMS(phoneNumber, Name, amount) {
    const apiKey = "Tq58WlkcY26wRAVrDniLaKgUudG9myv7NIsQejEZ3C0f1HOhtoQTKj436rehuAbPDFf9ZRix8LYNoCyn"; // Replace with your actual API key
    if (!apiKey) {
      console.error("Missing FAST2SMS_API_KEY environment variable");
      return;
    }

    // Check if donations array is empty or undefined
    if (!donations || donations.length === 0) {
      console.error("Donations array is empty or undefined.");
      return;
    }

    const donation = donations.find((donation) => donation.number === phoneNumber);

    if (!donation) {
      console.error("Donation not found for phone number:", phoneNumber);
      return;
    }

    if (donation.messageSent) {
      console.log("SMS already sent for this donation.");
      return;
    }

    const route = 'q'; // Quick transactional route (adjust if needed)
    const message = `${Name}, ₹${amount} Received By Gokulwadi Hanumanji Mandir. `;

    const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    url.searchParams.set('authorization', apiKey);
    url.searchParams.set('route', route);
    url.searchParams.set('message', message);
    url.searchParams.set('flash', '0'); // Standard message
    url.searchParams.set('numbers', phoneNumber); // Single recipient

    try {
      const response = await fetch(url.toString(), {
        method: 'GET', // GET request for Fast2SMS Bulk API
        headers: {
          'Content-Type': 'application/json', // Optional header for some APIs
        },
      });

      const data = await response.json();

      if (data.return === true) {
        console.log('SMS sent successfully:', data);
        donation.messageSent = true; // Mark message as sent after successful verification
      } else {
        console.error('Error sending SMS:', data);
        // Handle errors appropriately (e.g., log error and notify admins)
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      // Handle errors appropriately (e.g., log error and notify admins)
    }
  }

  const handleVerify = async (donationId) => {
    try {
      const donationRef = doc(db, "unverifiedAarti", donationId);

      // Get the entire donation object before updating
      const donationSnapshot = await getDoc(donationRef);
      const donation = { id: donationSnapshot.id, ...donationSnapshot.data() };

      if (donation) {
        // Transfer the donation data to the verifiedDonations collection and delete it after processing
        await transferToVerified(donation);

        // Update total amount and count if necessary (based on donation amount)
        setTotalAmount(prevTotal => prevTotal - parseInt(donation.amount));
        setTotalDonationsCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error("Error verifying donation:", error);
      // Handle verification error (e.g., display notification)
    }
  };

  const handleDelete = async (donationId) => {
    try {
      const donationRef = doc(db, "unverifiedAarti", donationId);
      await deleteDoc(donationRef);

      // Update local state to remove deleted donation
      const updatedDonations = donations.filter((donation) => donation.id !== donationId);
      setDonations(updatedDonations);

      // Update total amount and count if necessary (based on donation amount)
      const remainingDonations = updatedDonations.filter((donation) => !donation.verified);
      const updatedTotalAmount = remainingDonations.reduce(
        (acc, donation) => acc + parseInt(donation.donationAmount),
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
                  <span className="block  font-medium tracki uppercase">{donation.name}</span>
                  <span className="block  font-medium tracki uppercase">{donation.fatherName}</span>
                  <span className="block  font-medium tracki uppercase">{donation.date}</span>
                  <h2 className="block font-medium tracki uppercase">₹ {donation.donationAmount}/-</h2>
                  </div>
                  <div className="flex justify-around w-full">
                    {donation.verified ? (
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md disabled:opacity-50">Verified</button>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          className=" bg-green-200 hover:bg-green-400 text-xl focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 text-green-950 text-center dark:focus:ring-green-800"
                          onClick={() => handleVerify(donation.id)}
                          disabled={donation.verified} 
                        >
                          {donation.verified ? <GoCheckCircle /> : <GoCheckCircle />}
                        </button>
                        <button
  className=" bg-green-200 hover:bg-green-400 text-lg focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 text-green-950  text-center dark:focus:ring-green-800"
  onClick={() => sendSMS(donation.number, donation.name, donation.amount)} // Use a function reference
>
  Send MSG
</button>

                        <button
                          className="text-red-900 bg-red-200 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-5 text-center dark:focus:ring-red-800"
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
}

export default unverifiedAarti