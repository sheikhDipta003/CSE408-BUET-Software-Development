const Review = require("../models/Review");
const User = require("../models/User");

const reviewController = {
  // Create a new review
  async createReview(req, res) {
    try {
      const { content, rating } = req.body;
      const userId = req.params.userId;
      console.log(userId);
      const review = await Review.create({
        content: content,
        rating: rating,
        UserUserId: userId,
      });
      return res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      return res.status(500).json({ message: "Failed to create review" });
    }
  },

  // Get all reviews
  async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll({
          order: [['createdAt', 'DESC']],
          limit: 3
      });
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  },

  async getUserReviews(req, res) {
    const userId = req.params.userId;
    try {
      const userReviews = await Review.findAll({
        where: { UserUserId: userId },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(userReviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get review by ID
  async getReviewById(req, res) {
    const { reviewId } = req.params;
    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      return res.status(200).json(review);
    } catch (error) {
      console.error("Error fetching review by ID:", error);
      return res.status(500).json({ message: "Failed to fetch review" });
    }
  },

  // Update review by ID
  async updateReview(req, res) {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (!Number.isInteger(parseInt(rating)) || parseInt(rating) < 0 || parseInt(rating) > 5)
      {
        return res.status(400).json({ message: "Rating must be a nonnegative integer between 0 and 5, inclusive." });
      }

      review.content = content;
      review.rating = rating;
      await review.save();
      return res.status(200).json({review: review, message: "Review saved successfully"});
    } catch (error) {
      console.error("Error updating review:", error);
      return res.status(500).json({ message: "Failed to update review" });
    }
  },

  // Delete review by ID
  async deleteReview(req, res) {
    const { reviewId } = req.params;
    try {
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      await review.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ message: "Failed to delete review" });
    }
  },

  async getUnapprovedReviews(req, res){
    try {
      const reviews = await Review.findAll({
          where: { approved: ["False"] },
          include: [
            {
                model: User,
                attributes: ['username', 'userId']
            }
          ]
      });

      const formattedReviews = reviews.map(review => ({
        reviewId: review.reviewId,
        content: review.content,
        rating: review.rating,
        userId: review.User.userId,
        approved: review.approved,
        username: review.User.username
      }));
      
      return res.status(200).json(formattedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  },
  
  async approveReview(req, res){
    try {
        const reviewId = req.params.reviewId;
        const review = await Review.findByPk(reviewId);
  
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        await review.update({ approved: true });
  
        return res.status(200).json({ message: "Review approved successfully" });
    } catch (error) {
        console.error("Error approving review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = reviewController;
