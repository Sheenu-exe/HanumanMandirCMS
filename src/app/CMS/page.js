"use client";


import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "@firebase/firestore";
import { db } from "../API/firebase.config";

import Layout from "@/components/Layout";

const CMS = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [upcomingAarti, setUpcomingAarti] = useState(null);
  const [upcomingPrasadi, setUpcomingPrasadi] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "donations");
        const q = query(donationsRef);
        const donationSnapshot = await getDocs(q);

        const donationData = donationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(donationData);

        const total = donationData.reduce((acc, donation) => acc + parseInt(donation.amount), 0);
        setTotalAmount(total);
        setTotalDonationsCount(donationData.length);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const fetchUpcomingAarti = async () => {
      try {
        const aartiRef = collection(db, "verifiedAarti");
        const q = query(aartiRef, orderBy("date", "asc"));
        const aartiSnapshot = await getDocs(q);

        const currentDate = new Date();
        const upcomingAartiData = aartiSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((aarti) => new Date(aarti.date) > currentDate);

        setUpcomingAarti(upcomingAartiData);
      } catch (error) {
        console.error("Error fetching upcoming Aarti:", error);
      }
    };

    const fetchUpcomingPrasadi = async () => {
      try {
        const prasadiRef = collection(db, "verifiedPrasadi");
        const q = query(prasadiRef, orderBy("date", "asc"));
        const prasadiSnapshot = await getDocs(q);

        const currentDate = new Date();
        const upcomingPrasadiData = prasadiSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((prasadi) => new Date(prasadi.date) > currentDate);

        setUpcomingPrasadi(upcomingPrasadiData);
      } catch (error) {
        console.error("Error fetching upcoming Prasadi:", error);
      }
    };

    fetchDonations();
    fetchUpcomingAarti();
    fetchUpcomingPrasadi();
  }, []);

  return (
    <Layout>
      <div className="h-[100vh] w-full flex flex-col">
  
        <div className="w-full h-full flex justify-center flex-col items-center">
          <div className="rounded-lg border gap-y-2 border-gray-100 h-[90%] sm:flex-row flex-wrap flex flex-col justify-center  items-center gap-x-7">
            <div id="upcomingAarti" className="sm:w-[90%] w-[95%] h-[70%] flex flex-col justify-center rounded-lg bg-gray-200">
              <p className="text-4xl mx-3">आगामी आरती:</p>
              {upcomingAarti ? (
                <div className="mx-3 gap-y-3 flex flex-col">
                <p className="text-2xl font-medium text-gray-900">आगामी आरती {upcomingAarti.name} के द्वारा दिनांक {upcomingAarti.date} को है</p>
                <p className="text-xl font-medium text-gray-900">पिता का नाम:{upcomingAarti.fatherName}</p>
                <p className="text-lg font-medium text-gray-900">Mobile Number:{upcomingAarti.mobileNumber}</p>
                </div>
              ) : (
                <p className="text-2xl font-medium text-gray-900">No upcoming Aarti Booking</p>
              )}
            </div>
            <div id="upcomingPrasadi"className="sm:w-[90%] w-[95%] h-[70%] flex flex-col justify-center rounded-lg bg-gray-200">
              <p className="text-4xl mx-3">आगामी प्रसाद:</p>
              {upcomingPrasadi ? (
                <div className="mx-3 gap-y-3 flex flex-col">
                <p className="text-2xl font-medium text-gray-900">आगामी प्रसाद {upcomingPrasadi.name} के द्वारा दिनांक {upcomingPrasadi.date} को है</p>
                <p className="text-xl font-medium text-gray-900">पिता का नाम:{upcomingPrasadi.fatherName}</p>
                <p className="text-lg font-medium text-gray-900">Mobile Number:{upcomingPrasadi.mobileNumber}</p>
                </div>
              ) : (
                <p className="text-2xl font-medium text-gray-900">No upcoming Prasadi</p>
              )}
            </div>
            <div className="sm:w-[90%] w-[95%] h-[75%] rounded-lg bg-gray-200"></div>
            <div className="sm:w-[90%] w-[95%] h-[75%] rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CMS;
