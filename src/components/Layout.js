// components/Layout.js

import React from "react";
import { Header } from "./header";
import { Sidebar } from "./dashboard";

const Layout = ({ children }) => {
  return (
    <main className="flex min-h-screen fixed top-0 left-0 flex-col">
      <div className="flex flex-col ">
        <Header />
        <div className="flex ">
          <Sidebar />
          <div className="flex-grow  overflow-scroll w-[100vw]">{children}</div>
        </div>
      </div>
      
    </main>
  );
};

export default Layout;
