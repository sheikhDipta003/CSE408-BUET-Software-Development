import { useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const ColEventAdd = ({ collabId }) => {
  const errRef = useRef();
  const axiosPrivate = useAxiosPrivate();

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

  const handleCancel = () => {
    setEventName("");
    setVenue("");
    setDate(new Date());
    setDesc("");
    setURL("");
  };

  return (
    <>
      {success ? (
        <section>
          <h1 className="bg-green-400 w-full px-4 py-2 flex justify-center items-center">Successfully added!</h1>
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
          <h1 className="text-2xl bg-green-500 text-white px-4 py-2 rounded inline-flex items-center">
            Enter Event Details to Create a New Event
          </h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="eventName" className="block">
                Event Name:
              </label>
              <input
                type="text"
                id="eventName"
                autoComplete="off"
                onChange={(e) => setEventName(e.target.value)}
                value={eventName}
                required
                placeholder="Enter event name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="venue" className="block">
                Venue:
              </label>
              <input
                type="text"
                id="venue"
                onChange={(e) => setVenue(e.target.value)}
                value={venue}
                required
                placeholder="Enter venue"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block">
                Date:
              </label>
              <DatePicker
                selected={date}
                onChange={(date) => {
                  setDate(date);
                }}
                className="w-full p-2 border border-gray-300 rounded cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block">
                Description:
              </label>
              <textarea
                id="description"
                onChange={(e) => setDesc(e.target.value)}
                value={description}
                required
                placeholder="Enter description"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="url" className="block">
                URL:
              </label>
              <input
                type="text"
                id="url"
                onChange={(e) => setURL(e.target.value)}
                value={url}
                required
                placeholder="Enter URL"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mr-2"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Event
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
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

export default ColEventAdd;
