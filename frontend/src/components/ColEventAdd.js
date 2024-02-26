import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../css/Register.css";
import DatePicker from "react-datepicker";

const ColEventAdd = ({ collabId }) => {
  const errRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const [show, setShow] = useState(false);

  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDesc] = useState("");
  const [url, setURL] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "/collab/event/add",
        JSON.stringify({
          name: eventName,
          venue,
          date,
          description,
          url,
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
        setErrMsg("Adding Event Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Successfully added!</h1>
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
          <h1>Add Event</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="eventName">Name:</label>
            <input
              type="text"
              id="eventName"
              autoComplete="off"
              onChange={(e) => setEventName(e.target.value)}
              value={eventName}
              required
            />

            <label htmlFor="venue">Venue:</label>
            <input
              type="text"
              id="venue"
              onChange={(e) => setVenue(e.target.value)}
              value={venue}
              required
            />

            <label htmlFor="date">Date:</label>
            <DatePicker
             selected={date}
             onChange={(date)=> {setDate(date)}}
             />

            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              onChange={(e) => setDesc(e.target.value)}
              value={description}
              required
            />

            <label htmlFor="url">URL:</label>
            <input
              type="text"
              id="url"
              onChange={(e) => setURL(e.target.value)}
              value={url}
              required
            />

            <button>Add Event</button>
          </form>
        </section>
      )}
    </>
  );
};

export default ColEventAdd;
