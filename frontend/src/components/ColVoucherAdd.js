import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/Register.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const ColVoucherAdd = ({ collabId }) => {
  const errRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountPercentage, setDiscountPer] = useState(0);
  const [maxAmount, setMaxAmount] = useState();
  const [minAmount, setMinAmount] = useState();
  const [total, setTotal] = useState();
  const [endDate, setEndDate] = useState(new Date());

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

  return (
    <>
      {success ? (
        <section>
          <h1>Voucher Successfully Added!</h1>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Add Voucher</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="voucherCode">Voucher Code:</label>
            <input
              type="text"
              id="voucherCode"
              autoComplete="off"
              onChange={(e) => setVoucherCode(e.target.value)}
              value={voucherCode}
              required
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
            />

            <label htmlFor="endDate">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />

            <label htmlFor="maxAmount">Max Amount:</label>
            <input
              type="number"
              id="maxAmount"
              onChange={handleMax}
              value={maxAmount}
            />

            <label htmlFor="minAmount">Min Amount:</label>
            <input
              type="number"
              id="minAmount"
              onChange={handleMin}
              value={minAmount}
            />

            <label htmlFor="total">Total Vouchers:</label>
            <input
              type="number"
              id="total"
              onChange={handleTotal}
              value={total}
            />

            <button>Add Voucher</button>
          </form>
        </section>
      )}
    </>
  );
};

export default ColVoucherAdd;
