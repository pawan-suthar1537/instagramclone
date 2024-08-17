import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <LeftSideBar className="w-full md:w-64" />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
