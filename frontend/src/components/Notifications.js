import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

const Notifications = () => {
    const axiosPrivate = useAxiosPrivate();
    const [notifs, setNotifs] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        let isMounted = true;

        const getNotifs = async () => {
            try {
                const response = await axiosPrivate.get(
                    `/users/${userId}/notification`,
                );
                console.log("from Notifications.js = ", response.data.notifications);
                isMounted && setNotifs(response.data.notifications);
            } catch (err) {
                console.error(err);
            }
        };

        getNotifs();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (notifId) => {
        console.log("Deleting notif:", notifId);
        try {
            await axiosPrivate.get(`users/${userId}/notification/${notifId}/delete`);
            const notifList = notifs.filter((notif) => notif.notifId !== notifId);
            setNotifs(notifList);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    };

    const markAsRead = async (notifId) => {
        console.log("Marking notif as read:", notifId);
        try {
            await axiosPrivate.get(`users/${userId}/notification/${notifId}/mark`);
            // Update notif's status
            const updatedNotifs = notifs.map((notif) =>
                notif.notifId === notifId ? { ...notif, isRead: true } : notif,
            );
            setNotifs(updatedNotifs);
        } catch (err) {
            console.error("Error marking notif as read:", err);
        }
    };

    const unreadNotifs = notifs.filter(notif => !notif.isRead);
    const readNotifs = notifs.filter(notif => notif.isRead);

    return (
        <div className='mx-8 my-4'>
            <h2 className="mb-4 text-xl font-bold">Unread Notifications</h2>
            {unreadNotifs.length === 0 && (
                <p className='p-2 m-4 border-l-4 border-l-emerald-400'>You've read all the messages in your inbox.</p>
            )}
            {unreadNotifs.map(notif => (
                <div key={notif.notifId} className="notification-card bg-teal-300 p-4 m-4 rounded-lg shadow">
                    <div className="accordion-header hover:cursor-pointer" onClick={() => markAsRead(notif.notifId)}>
                        {notif.title}
                        <FontAwesomeIcon icon={faTrash} className="cursor-pointer float-right" onClick={() => handleDelete(notif.notifId)} />
                    </div>
                    {notif.isRead && <p className='bg-teal-100'>{notif.message}</p>}
                </div>
            ))}

            <h2 className="mb-4 text-xl font-bold">Read Notifications</h2>
            {readNotifs.length === 0 && (
                <p className='p-2 m-4 border-l-4 border-l-emerald-400'>You haven't read any of the messages!</p>
            )}
            {readNotifs.map(notif => (
                <div key={notif.notifId} className="notification-card  p-4 m-4 rounded-lg shadow bg-teal-100 border-l-4 border-l-emerald-400">
                    <div className="accordion-header hover:cursor-pointer bg-teal-300 p-2 rounded-md">
                        {notif.title}
                        <FontAwesomeIcon icon={faTrash} className="cursor-pointer float-right text-red-700 hover:text-red-800" onClick={() => handleDelete(notif.notifId)} />
                    </div>
                    {notif.isRead && <p className='bg-teal-100 p-2'>{notif.message}</p>}
                </div>
            ))}
        </div>
    );
};

export default Notifications;
