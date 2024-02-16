import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faInfoCircle, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserEvent = ({ userId }) => {
    const axiosPrivate = useAxiosPrivate();
    const [userEvents, setUserEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('Following'); // 'Following' or 'Upcoming'
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [startechFilter, setStartechFilter] = useState(false);
    const [ryanscomputersFilter, setRyanscomputersFilter] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${userId}/events`);
                console.log("from UserEvent = ", response.data);
                const response2 = await axiosPrivate.get(`/users/${userId}/upcomingevents`);
                console.log("from UserEvent = ", response2.data);
                isMounted && setUserEvents(response.data);
                isMounted && setUpcomingEvents(response2.data);
            } catch (err) {
                console.error(err);
                alert(err.response.data.message);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        // Filter events based on the search query
        const filteredUserEvents = userEvents.filter(event =>
            event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.date.includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.websiteName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const filteredUpcomingEvents = upcomingEvents.filter(event =>
            event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.date.includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.websiteName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Filter events based on website filters
        let filteredEventsByWebsite = activeTab === 'Following' ? filteredUserEvents : filteredUpcomingEvents;
        if (startechFilter) {
            filteredEventsByWebsite = filteredEventsByWebsite.filter(event => event.websiteName.toLowerCase() === 'startech');
        }
        if (ryanscomputersFilter) {
            filteredEventsByWebsite = filteredEventsByWebsite.filter(event => event.websiteName.toLowerCase() === 'ryanscomputers');
        }

        // Set the filtered events
        setFilteredEvents(filteredEventsByWebsite);
    }, [searchQuery, userEvents, upcomingEvents, activeTab, startechFilter, ryanscomputersFilter]);

    const handleEventUnFollow = async (eId) => {
        try {
            const response = await axiosPrivate.delete(`/users/${userId}/events/${eId}/unfollow`);
            setUserEvents(prevEvents => prevEvents.filter(event => event.eId !== eId));
            if (new Date(response.data.event.date) > new Date()) setUpcomingEvents([...upcomingEvents, response.data.event]);
        } catch (err) {
            console.error(err);
            alert(err.response.data.message);
        }
    }

    const handleEventFollow = async (eId) => {
        try {
            const response = await axiosPrivate.get(`/users/${userId}/upcomingevents/${eId}/follow`);
            setUserEvents([...userEvents, response.data.event]);
            setUpcomingEvents(prevEvents => prevEvents.filter(event => event.eId !== eId));
        } catch (err) {
            console.error(err);
            alert(err.response.data.message);
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div className="relative">
            <div className="flex justify-center mt-4 w-5/6">
                <button
                    className={`mr-2 px-4 py-2 rounded focus:outline-none ${activeTab === 'Following' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('Following')}
                >
                    Following
                </button>
                <button
                    className={`px-4 py-2 rounded focus:outline-none ${activeTab === 'Upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('Upcoming')}
                >
                    Upcoming Events
                </button>
            </div>

            <div className="mt-4 w-5/6">
                <input
                    type="text"
                    placeholder="Search for event name, description, website name..."
                    className="px-4 py-2 rounded mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="w-1/4 absolute top-[15vh] left-[53vw] ml-10 p-4">
                <p className="text-black font-bold mb-2 border-b-4 border-blue-700">Websites</p>
                <div className="mb-2 flex flex-row ">
                    <input
                        type="checkbox"
                        id="startech"
                        name="startech"
                        checked={startechFilter}
                        onChange={() => setStartechFilter(!startechFilter)}
                        className="size-5 hover:cursor-pointer"
                    />
                    <label htmlFor="startech" className="ml-2 font-normal text-black mt-0 hover:text-red-600 hover:cursor-pointer">Startech</label>
                </div>
                <div className="mb-2 pb-2 flex flex-row border-b-4 border-b-blue-700">
                    <input
                        type="checkbox"
                        id="ryanscomputers"
                        name="ryanscomputers"
                        checked={ryanscomputersFilter}
                        onChange={() => setRyanscomputersFilter(!ryanscomputersFilter)}
                        className="size-5 hover:cursor-pointer"
                    />
                    <label htmlFor="ryanscomputers" className="ml-2 text-black mt-0 font-normal hover:text-red-600 hover:cursor-pointer">Ryanscomputers</label>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-5/6 mt-0">
                {filteredEvents.map(event => (
                    <div key={event.eventName} className="relative bg-lime-200 p-4 rounded-lg mb-4">
                        <div className="absolute top-0 right-0 mt-0 mr-2 flex">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                            {activeTab === 'Following' ? (
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleEventUnFollow(event.eId)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            ) : (
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    onClick={() => handleEventFollow(event.eId)}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-10">{event.eventName}</h3>
                        <p className="text-l text-blue-500 font-bold mb-2">{event.websiteName}</p>
                        <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="mb-2">{event.description}</p>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserEvent;
