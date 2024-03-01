import { useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const ColVoucherAdd = ({ collabId }) => {
  const errRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountPercentage, setDiscountPer] = useState(0);
  const [maxAmount, setMaxAmount] = useState();
  const [minAmount, setMinAmount] = useState();
  const [total, setTotal] = useState();
  const [endDate, setEndDate] = useState(new Date());

  const handleCancel = () => {
    setVoucherCode("");
    setDiscountPer(0);
    setMaxAmount();
    setMinAmount();
    setTotal();
    setEndDate(new Date());
  };

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "/collab/voucher/add",
        JSON.stringify({
          voucherCode,
          discountPercentage,
          maxAmount,
          minAmount,
          endDate,
          total,
          collabId,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Adding Voucher Failed");
      }
      errRef.current.focus();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && value >= 0 && value <= 100) {
      setDiscountPer(value);
    }
  };

  const handleMin = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setMinAmount(value);
    }
  };

  const handleMax = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setMaxAmount(value);
    }
  };

  const handleTotal = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setTotal(value);
    }
  };

  const handleAddVoucher = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "/collab/voucher/add",
        JSON.stringify({
          voucherCode,
          discountPercentage,
          maxAmount,
          minAmount,
          endDate,
          total, 
          collabId
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Adding Event Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className="w-full px-4 py-2 flex justify-center items-center bg-green-500 text-white font-semibold">Voucher Successfully Added!</div>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          
          <h1 className="text-2xl bg-green-500 text-white px-4 py-2 rounded inline-flex items-center">
            Enter Voucher Details to Create a New Voucher
          </h1>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <label htmlFor="voucherCode">Voucher Code:</label>
            <input
              type="text"
              id="voucherCode"
              autoComplete="off"
              onChange={(e) => setVoucherCode(e.target.value)}
              value={voucherCode}
              required
              className="border-2 rounded px-4 py-2 mb-2 block"
            />
            <label htmlFor="discountPercentage">Discount Percentage:</label>
            <input
              type="number"
              id="discountPercentage"
              min={0}
              max={100}
              onChange={handleChange}
              value={discountPercentage}
              required
              className="border-2 rounded px-4 py-2 mb-2 block"
            />

            <label htmlFor="endDate">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border-2 rounded px-4 py-2 mb-2 block"
            />

            <label htmlFor="maxAmount">Max Amount:</label>
            <input
              type="number"
              id="maxAmount"
              onChange={handleMax}
              value={maxAmount}
              className="border-2 rounded px-4 py-2 mb-2 block"
            />

            <label htmlFor="minAmount">Min Amount:</label>
            <input
              type="number"
              id="minAmount"
              onChange={handleMin}
              value={minAmount}
              className="border-2 rounded px-4 py-2 mb-2 block"
            />

            <label htmlFor="total">Total Vouchers:</label>
            <input
              type="number"
              id="total"
              onChange={handleTotal}
              value={total}
              className="border-2 rounded px-4 py-2 mb-2 block"
            />

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mr-2"
                onClick={handleAddVoucher}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Voucher
              </button>
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
                onClick={handleCancel}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Clear All
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default ColVoucherAdd;
