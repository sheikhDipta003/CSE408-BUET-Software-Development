import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faGift} from "@fortawesome/free-solid-svg-icons";

const VoucherManagement = ({ collabId }) => {
  const [vouchers, setVouchers] = useState([]);
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
      await axiosPrivate.delete(
        `collab/${collabId}/vouchers/${voucherId}/remove`,
      );
      setVouchers((prevVouchers) =>
        prevVouchers.filter((Voucher) => Voucher.voucherId !== voucherId),
      );
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  const handleAssignVoucherRandom = async(voucherId) => {
    // console.log('Assign Randomly button clicked');
    try {
      const response = await axiosPrivate.get(`/collab/voucher/assign2/${voucherId}`);
      alert(response.data.message);
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
              onClick={() => handleAssignVoucherRandom(voucher.voucherId)}
              className="text-green-700 hover:text-green-800 bg-teal-100"
              disabled={voucher.total === 0}
            >
              <FontAwesomeIcon icon={faGift} />
              <span className="ml-2">Assign Randomly</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherManagement;
