import React, { useState } from "react";
import ColEventAdd from "./ColEventAdd";
import ColVoucherAdd from "./ColVoucherAdd";
import EventManagement from "./ColEventManage";
import VoucherManagement from "./ColVoucherManage";
import CollabProducts from "./CollabProducts";

const Collaborator = ({ collabId }) => {
  const [activeMenu, setActiveMenu] = useState("Vouchers");
  const [activeSubMenu, setActiveSubMenu] = useState("AllV");

  console.log("Collaborator.js = ", collabId);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if(menu === "Vouchers")
      setActiveSubMenu("AllV");
    else if(menu === "Events")
      setActiveSubMenu("AllE");
  };

  const handleSubMenuClick = (submenu) => {
    setActiveSubMenu(submenu);
  };

  return (
    <div className="flex justify-center py-8">
      <div className="flex">
        <div className="min-w-32 p-4 border-r border-red-500">
          <h2 className="text-lg font-bold mb-4">Collaborator Menu</h2>
          <ul>
            <li
              className={`cursor-pointer ${activeMenu === "Vouchers" ? "text-red-500 font-bold" : "text-black"} mb-4`}
              onClick={() => handleMenuClick("Vouchers")}
            >
              Vouchers
            </li>
            <li
              className={`cursor-pointer ${activeMenu === "Events" ? "text-red-500 font-bold" : "text-black"} mb-4`}
              onClick={() => handleMenuClick("Events")}
            >
              Events
            </li>
            <li
              className={`cursor-pointer ${activeMenu === "Products" ? "text-red-500 font-bold" : "text-black"} mb-4`}
              onClick={() => handleMenuClick("Products")}
            >
              Products
            </li>
            <li
              className={`cursor-pointer ${activeMenu === "My Profile" ? "text-red-500 font-bold" : "text-black"} mb-4`}
              onClick={() => handleMenuClick("My Profile")}
            >
              My Profile
            </li>
            <li
              className={`cursor-pointer ${activeMenu === "Settings" ? "text-red-500 font-bold" : "text-black"} mb-4`}
              onClick={() => handleMenuClick("Settings")}
            >
              Settings
            </li>
          </ul>
        </div>
        <div className="w-full p-4">
          {activeMenu === "Vouchers" && (
            <div>
              <ul className="flex ">
                <li
                  className={`cursor-pointer ${activeSubMenu === "AllV" ? "border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md rounded-b-none p-2" : "text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300"} mb-1 mr-4`}
                  onClick={() => handleSubMenuClick("AllV")}
                >
                  All Vouchers
                </li>
                <li
                  className={`cursor-pointer ${activeSubMenu === "AddV" ? "border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md  rounded-b-none p-2" : "text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300"} mb-1 mr-4`}
                  onClick={() => handleSubMenuClick("AddV")}
                >
                  Add a Voucher
                </li>
              </ul>
              {activeSubMenu === "AllV" && (
                <VoucherManagement collabId={collabId} />
              )}
              {activeSubMenu === "AddV" && (
                <ColVoucherAdd collabId={collabId} />
              )}
            </div>
          )}
          {activeMenu === "Events" && (
            <div>
              <ul className="flex ">
                <li
                  className={`cursor-pointer ${activeSubMenu === "AllE" ? "border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md rounded-b-none p-2" : "text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300"} mb-1 mr-4`}
                  onClick={() => handleSubMenuClick("AllE")}
                >
                  All Events
                </li>
                <li
                  className={`cursor-pointer ${activeSubMenu === "AddE" ? "border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md  rounded-b-none p-2" : "text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300"} mb-1 mr-4`}
                  onClick={() => handleSubMenuClick("AddE")}
                >
                  Add an Event
                </li>
              </ul>
              {activeSubMenu === "AllE" && (
                <EventManagement collabId={collabId} />
              )}
              {activeSubMenu === "AddE" && <ColEventAdd collabId={collabId} />}
            </div>
          )}
          {activeMenu === "Products" && (
            <CollabProducts collabId={collabId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Collaborator;
