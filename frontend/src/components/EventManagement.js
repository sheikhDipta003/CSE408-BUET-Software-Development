import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faCheckSquare,
  faTrash,
  faThumbsUp,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get(`/admin/events`);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eId) => {
    try {
      await axiosPrivate.delete(`admin/events/${eId}/delete`);
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.eId !== eId),
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteSelected = async () => {
    const selectedEvents = events.filter((e) => e.isSelected);
    try {
      await Promise.all(
        selectedEvents.map((e) => handleDelete(e.eId)),
      );
    } catch (error) {
      console.error("Error deleting selected events:", error);
    }
  };

  const handleCheckboxChange = (eId) => {
    const updatedEvents = events.map((e) => {
      if (e.eId === eId) {
        return { ...e, isSelected: !e.isSelected };
      }
      return e;
    });
    setEvents(updatedEvents);
  };

  const toggleSelectAll = () => {
    const updatedEvents = events.map((e) => ({
      ...e,
      isSelected: !selectAll,
    }));
    setEvents(updatedEvents);
    setSelectAll(!selectAll);
  };

  const handleApprove = async (eId) => {
    try {
      await axiosPrivate.put(`admin/events/${eId}/approve`);
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.eId !== eId),
      );
      } catch (error) {
        console.error('Error approving event:', error);
      }
    };

  const handleApproveSelected = async () => {
    const selectedEvents = events.filter((e) => e.isSelected);
    try {
      await Promise.all(
        selectedEvents.map((e) =>
          handleApprove(e.eId),
        ),
      );
    } catch (error) {
      console.error("Error approving selected events:", error);
    }
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

      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={toggleSelectAll}
            className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100"
            disabled={events.length === 0}
          >
            {selectAll ? (
              <FontAwesomeIcon icon={faCheckSquare} />
            ) : (
              <FontAwesomeIcon icon={faSquare} />
            )}
            <span className="ml-2">Select All</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            className="text-red-700 hover:text-red-800 bg-teal-100"
            disabled={
              events.filter((e) => e.isSelected).length === 0
            }
          >
            <FontAwesomeIcon icon={faTrash} />
            <span className="ml-2">Delete</span>
          </button>
          {filter === "unapproved" && (
            <button
              onClick={handleApproveSelected}
              className="text-green-700 hover:text-green-800 bg-teal-100 ml-4"
              disabled={events.filter((e) => e.isSelected).length === 0}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="ml-2">Approve</span>
            </button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-red-400 w-full px-4 py-2 flex justify-center items-center">No Events to display</div>      
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEvents.map((e) => (
          <div
            key={e.eId}
            className="border-2 rounded p-4 relative border-blue-600"
          >
            {e.approved ? (
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

            <input
              type="checkbox"
              className="mt-2 size-4"
              checked={e.isSelected || false}
              onChange={() => handleCheckboxChange(e.eId)}
            />
            <div className="text-lg font-semibold mb-2 mt-2 border-b-2 border-violet-500">
              {e.name}
            </div>
            <div className="mb-2 border-b-2 border-violet-500">
              Venue: {e.venue}
            </div>
            <div className="mb-2 border-b-2 border-violet-500">
              Date:{" "}
              {new Date(e.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="mb-2">{e.description}</div>
            <button
              onClick={() => handleDelete(e.eId)}
              className="text-red-700 hover:text-red-800 bg-teal-100"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete Event</span>
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default EventManagement;
