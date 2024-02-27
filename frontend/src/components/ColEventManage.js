import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faSave, faTimes, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const EventManagement = ({ collabId }) => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editEventId, setEditEventId] = useState(null);
  const [newEventDetails, setNewEventDetails] = useState({
    name: "",
    venue: "",
    date: "",
    description: "",
    url: "",
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get(`/collab/${collabId}/events`);
        setEvents(response.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        alert(err.response?.data?.message || err.message);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get(`/collab/${collabId}/events`);
        setEvents(response.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        alert(err.response?.data?.message || err.message);
      }
    };

    fetchEvents();
  }, [events]);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axiosPrivate.delete(
        `collab/${collabId}/events/${eventId}/remove`
      );
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.eId !== eventId)
      );
      alert(response.data.message);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEditEvent = (eventId) => {
    setEditEventId(eventId);
    const event = events.find((event) => event.eId === eventId);
    setNewEventDetails({ ...event });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axiosPrivate.put(
        `collab/${collabId}/events/${editEventId}/update`,
        newEventDetails
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eId === editEventId ? newEventDetails : event
        )
      );
      setEditEventId(null);
      alert(response.data.message);
    } catch (err) {
      console.error("Error saving edited event:", err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditEventId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "approved") {
      return event.approved === true;
    } else if (filter === "unapproved") {
      return event.approved === false;
    } else {
      return true;
    }
  });

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <label className="text-md flex items-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="all"
            className="size-5 mr-2 cursor-pointer"
            checked={filter === "all"}
            onChange={() => setFilter("all")}
          />
          All
        </label>
        <label className="text-md flex items-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="approved"
            className="size-5 mr-2 cursor-pointer"
            checked={filter === "approved"}
            onChange={() => setFilter("approved")}
          />
          Approved
        </label>
        <label className="text-md flex items-center cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="unapproved"
            className="size-5 mr-2 cursor-pointer"
            checked={filter === "unapproved"}
            onChange={() => setFilter("unapproved")}
          />
          Unapproved
        </label>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-red-400 w-full px-4 py-2 flex justify-center items-center">No Events to display</div>      
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.eId}
            className="border-2 rounded p-4 relative border-blue-600"
          >
            {event.approved ? (
              <div className="bg-green-500 text-white px-2 py-1 rounded-lg">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span className="ml-2">Approved</span>
              </div>
            ) : (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full">
                <FontAwesomeIcon icon={faTimesCircle} />
                <span className="ml-2">Not Approved</span>
              </div>
            )}

            <div className="text-lg font-semibold mb-2 mt-4 border-b-2 border-violet-500">
              {event.name}
            </div>
            <div className="mb-2 border-b-2 border-violet-500">
              Venue: {event.venue}
            </div>
            <div className="mb-2 border-b-2 border-violet-500">
              Date:{" "}
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="mb-2">{event.description}</div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleDeleteEvent(event.eId)}
                className="text-red-700 hover:text-red-800 bg-teal-100"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span className="ml-2">Delete Event</span>
              </button>
              <button
                onClick={() => handleEditEvent(event.eId)}
                className="text-blue-700 hover:text-blue-800 bg-teal-100 ml-4"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span className="ml-2">Edit Event</span>
              </button>
              
            </div>
          </div>
        ))}
      </div>
      )}

      {editEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-5/6 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
            
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newEventDetails.name}
                onChange={handleInputChange}
                placeholder="Event Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="venue" className="block font-semibold mb-1">Venue</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={newEventDetails.venue}
                onChange={handleInputChange}
                placeholder="Venue"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newEventDetails.date}
                onChange={handleInputChange}
                placeholder="Date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block font-semibold mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={newEventDetails.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="url" className="block font-semibold mb-1">URL</label>
              <input
                type="text"
                id="url"
                name="url"
                value={newEventDetails.url}
                onChange={handleInputChange}
                placeholder="URL"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mr-2"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>

        </div>
      )}
    
    </div>
  );
};

export default EventManagement;
