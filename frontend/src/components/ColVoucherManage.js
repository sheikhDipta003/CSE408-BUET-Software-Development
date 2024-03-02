import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faGift, faTimes } from "@fortawesome/free-solid-svg-icons";

const VoucherManagement = ({ collabId }) => {
  const [vouchers, setVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState({
    voucherId: "",
    voucherCode:"",
    websiteName: ""
  });
  const [nVouchers, setNVouchers] = useState(1);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axiosPrivate.get(`/collab/${collabId}/vouchers`);
        console.log(response);
        setVouchers(response.data.vouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleDeleteVoucher = async (voucherId) => {
    try {
      await axiosPrivate.delete(`collab/${collabId}/vouchers/${voucherId}/remove`);
      setVouchers((prevVouchers) => prevVouchers.filter((Voucher) => Voucher.voucherId !== voucherId));
    } catch (err) {
      console.error("Error deleting voucher:", err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleAssignVoucherRandom = async (voucher) => {
    setSelectedVoucher({
      voucherId: voucher.voucherId,
      voucherCode: voucher.voucherCode,
      websiteName: voucher.websiteName
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedVoucher(null);
    setNVouchers(1);
  };

  const handleAssignVoucher = async () => {
    try {
      const response = await axiosPrivate.post(`/collab/voucher/assign2/${selectedVoucher.voucherId}`, { nVouchers });
      alert(response.data.message);
      handleModalClose();

      for (const userId of response.data.userIds){
        const res2 = await axiosPrivate.get(`/users/${userId}`);
        console.log(res2.data.username);
        const newNotif = {
          title:"Congratulations! You've Been Assigned a Voucher!", 
          message:`Dear ${res2.data.username}, ${selectedVoucher.websiteName} is excited to inform you that you have been assigned a voucher for our exclusive offer. This voucher brings you fantastic discounts on our products and services - Voucher Code: ${selectedVoucher.voucherCode}.`, 
          isRead: false, 
          userId: userId
        };
        await axiosPrivate.post(`admin/users/${userId}/notify`, newNotif);
        console.log(`Notified user ${userId}!`);
      }
    } catch (err) {
      console.error("Error assigning voucher:", err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl bg-green-500 text-white px-4 py-2 rounded flex justify-center items-center w-full mb-2">
        All Vouchers You Manage
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {vouchers.map((voucher) => (
          <div
            key={voucher.voucherId}
            className="border-2 rounded p-4 relative border-blue-600"
          >
            <div className="mb-2 border-b-2 border-violet-500">
              Voucher Code: {voucher.voucherCode}<br/>
              Discount Percentage: {voucher.discountPercentage}<br/>
              Max amount: {voucher.maxAmountForDiscount}<br/>
              End date:{" "}
              {new Date(voucher.endDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}<br/>
              Total: {voucher.total}
            </div>
            <button
              onClick={() => handleDeleteVoucher(voucher.voucherId)}
              className="text-red-700 hover:text-red-800 bg-teal-100 mr-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete Voucher</span>
            </button>

            <button
              onClick={() => handleAssignVoucherRandom(voucher)}
              className="text-green-700 hover:text-green-800 bg-teal-100"
              disabled={voucher.total === 0}
            >
              <FontAwesomeIcon icon={faGift} />
              <span className="ml-2">Assign Randomly</span>
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Assign Vouchers</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Enter the number of vouchers to assign:</p>
                      <input
                        type="number"
                        value={nVouchers}
                        onChange={(e) => setNVouchers(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleAssignVoucher}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Assign
                </button>

                <button
                  onClick={handleModalClose}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5 mr-2 inline-block" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
