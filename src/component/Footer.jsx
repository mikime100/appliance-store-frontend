import React from "react";
import { BG_CARD, HEADING_TEXT } from "../theme";

function Footer() {
  return (
    <footer
      style={{ background: "#023047", color: "white" }}
      className="w-full py-4 text-center relative"
    >
      {/* FOOTER DIV 2 - Copyright Text */}
      <div className="relative">
        <div>
          &copy; {new Date().getFullYear()} APPLIX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
