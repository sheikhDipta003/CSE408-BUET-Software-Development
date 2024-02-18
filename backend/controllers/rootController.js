const Review = require("../models/Review");
const User = require("../models/User");
const Event = require("../models/Event");
const Website = require("../models/Website");

const rootController = {
    // Get all reviews
    async getAllReviews(req, res) {
        try {
        const reviews = await Review.findAll({
            where: { approved: ["True"] },
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

    async getEventDetails(req, res) {
        const eId = req.params.eId;
    
        try {
        // Fetch event details including associated website
        const event = await Event.findByPk(eId, {
            include: [
            {
                model: Website,
                attributes: ["name"],
            },
            ],
        });
    
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
    
        const formatEvent = {
            eId: event.eId,
            eventName: event.name,
            venue: event.venue,
            date: event.date,
            description: event.description,
            websiteId: event.WebsiteWebsiteId,
            websiteName: event.Website.name
        };
    
        res.json(formatEvent);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = rootController