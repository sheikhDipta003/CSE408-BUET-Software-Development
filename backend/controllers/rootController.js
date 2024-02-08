const Review = require("../models/Review");
const User = require("../models/User");

const rootController = {
    // Get all reviews
    async getAllReviews(req, res) {
        try {
        const reviews = await Review.findAll({
            order: [['createdAt', 'DESC']],
            limit: 3,
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const formattedReviews = reviews.map(review => ({
            reviewId: review.reviewId,
            content: review.content,
            rating: review.rating,
            userId: review.User.userId,
            username: review.User.username
        }));
        
        return res.status(200).json(formattedReviews);
        } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Failed to fetch reviews" });
        }
    },
};

module.exports = rootController