import React from "react";
import { Header, SideBar } from "./components";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <SideBar />
      <main className="sm:ml-48 pt-[5rem] px-4 pb-4 min-h-screen">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
