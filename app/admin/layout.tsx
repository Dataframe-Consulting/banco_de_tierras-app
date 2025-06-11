import React from "react";
import { SideBar } from "./components";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SideBar />
      <main className="sm:ml-48">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
