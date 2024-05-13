// components/Layout.js

import React from "react";
import { Header } from "./header";
import { Sidebar } from "./dashboard";

const Layout = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-grow">{children}</div>
        </div>
      </div>
      
    </main>
  );
};

export default Layout;
