import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare, faTrash, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const AdminReview = () => {
    const [reviews, setReviews] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const getReviews = async () => {
            try {
                const response = await axiosPrivate.get(`/admin/reviews`);
                console.log(response.data);
                setReviews(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        getReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        try {
            await axiosPrivate.get(`admin/reviews/${reviewId}/delete`);
            setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleDeleteSelected = async () => {
        const selectedReviews = reviews.filter(review => review.isSelected);
        try {
            await Promise.all(selectedReviews.map(review => handleDelete(review.reviewId)));
        } catch (error) {
            console.error('Error deleting selected reviews:', error);
        }
    };

    const handleCheckboxChange = (reviewId) => {
        const updatedReviews = reviews.map(review => {
            if (review.reviewId === reviewId) {
                return { ...review, isSelected: !review.isSelected };
            }
            return review;
        });
        setReviews(updatedReviews);
    };

    const toggleSelectAll = () => {
        const updatedReviews = reviews.map(review => ({ ...review, isSelected: !selectAll }));
        setReviews(updatedReviews);
        setSelectAll(!selectAll);
    };

    const handleApprove = async (reviewId, userId) => {
        try {
            await axiosPrivate.put(`admin/reviews/${reviewId}/approve`);
            setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));

            const newNotif = {
                title:"Your Review hasb been Approved", 
                message:"Thank you for your feedback!", 
                isRead: false, 
                userId:userId
            };
            await axiosPrivate.post(`admin/users/${userId}/notify`, newNotif);
            console.log(`Notified user ${userId}!`);
        } catch (error) {
            console.error('Error approving review:', error);
        }
    };

    const handleApproveSelected = async () => {
        const selectedReviews = reviews.filter(review => review.isSelected);
        try {
            await Promise.all(selectedReviews.map(review => handleApprove(review.reviewId, review.userId)));
        } catch (error) {
            console.error('Error approving selected reviews:', error);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-2 mt-10 border-b-4 border-blue-500">Pending Reviews</h2>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <button onClick={toggleSelectAll} className="text-blue-700 hover:text-blue-800 mr-4 bg-teal-100" disabled={reviews.length === 0}>
                        {selectAll ? (
                            <FontAwesomeIcon icon={faCheckSquare} />
                        ) : (
                            <FontAwesomeIcon icon={faSquare} />
                        )}
                        <span className="ml-2">Select All</span>
                    </button>
                    <button onClick={handleDeleteSelected} className="text-red-700 hover:text-red-800 bg-teal-100" disabled={reviews.filter(review => review.isSelected).length === 0}>
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="ml-2">Delete</span>
                    </button>
                    <button onClick={handleApproveSelected} className="text-green-700 hover:text-green-800 bg-teal-100 ml-4" disabled={reviews.filter(review => review.isSelected).length === 0}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span className="ml-2">Approve</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reviews.map(review => (
                    <div key={review.reviewId} className="border-2 rounded p-4 relative border-blue-600">
                        <input
                            type="checkbox"
                            className="absolute top-2 left-4 size-4"
                            checked={review.isSelected || false}
                            onChange={() => handleCheckboxChange(review.reviewId)}
                        />
                        <div className="text-lg font-semibold mb-2 mt-4 border-b-2 border-violet-500">{review.username}</div>
                        <div className="mb-2 border-b-2 border-violet-500">Rating: {review.rating}</div>
                        <div className="mb-2">{review.content}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminReview;
