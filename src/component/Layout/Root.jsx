import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Ui/NavBar";
import Footer from "../Footer";
import { BG_LIGHT, HEADING_TEXT } from "../../theme";

const Root = () => {
  return (
    <div className="relative">
      <div
        style={{
          background: BG_LIGHT,
          color: HEADING_TEXT,
          minHeight: "100vh",
        }}
        className="relative"
      >
        {/* ROOT DIV 3 - Navigation Bar */}
        <div className="relative">
          <NavBar />
        </div>

        {/* ROOT DIV 4 - Main Content Outlet */}
        <div className="relative">
          <Outlet />
        </div>

        {/* ROOT DIV 5 - Footer */}
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Root;
