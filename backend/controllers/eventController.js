// controllers/eventController.js

const Event = require("../models/Event");
const Website = require("../models/Website");

// Controller function to fetch user events
const getUserEvents = async (req, res) => {
  try {
    // Fetch all events including associated websites
    const events = await Event.findAll({
      include: [
        {
          model: Website,
          attributes: ["name"],
        },
      ],
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to fetch event details by ID
const getEventDetails = async (req, res) => {
  const eventId = req.params.eid;

  try {
    // Fetch event details including associated website
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Website,
          attributes: ["name"], // Fetch only the name attribute from Website model
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserEvents,
  getEventDetails,
};
