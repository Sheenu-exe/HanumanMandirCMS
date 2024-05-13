"use client"
// pages/index.js

import React, { useState, useEffect } from "react";
import Auth from "./auth/page";
import CMS from "./CMS/page";
import Cookies from "js-cookie";


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the authentication cookie exists
    const isAuthenticatedCookie = Cookies.get("isAuthenticated");
    if (isAuthenticatedCookie === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array to run this effect only once when the component mounts

  return (
   <>
      {isAuthenticated ? <CMS /> : <Auth />}
      </>
    
  );
}
