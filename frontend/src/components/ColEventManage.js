import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EventManagement = ({collabId}) => {
    const [events, setEvents] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosPrivate.get(`/collab/${collabId}/events`);
                setEvents(response.data.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleDeleteEvent = async (eventId) => {
        try {
            await axiosPrivate.delete(`collab/${collabId}/events/${eventId}/remove`);
            setEvents(prevEvents => prevEvents.filter(event => event.eId !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 border-b-4 border-blue-500">Event Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                    <div key={event.eId} className="border-2 rounded p-4 relative border-blue-600">
                        <div className="text-lg font-semibold mb-2 mt-4 border-b-2 border-violet-500">{event.name}</div>
                        <div className="mb-2 border-b-2 border-violet-500">Venue: {event.venue}</div>
                        <div className="mb-2 border-b-2 border-violet-500">Date: {new Date(event.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                        <div className="mb-2">{event.description}</div>
                        <button onClick={() => handleDeleteEvent(event.eId)} className="text-red-700 hover:text-red-800 bg-teal-100">
                            <FontAwesomeIcon icon={faTrash} />
                            <span className="ml-2">Delete Event</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventManagement;
