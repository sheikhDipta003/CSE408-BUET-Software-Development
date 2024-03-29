const Event = require("../models/Event");
const Website = require("../models/Website");

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific event by event_id
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveEvent = async (req, res) => {
  try {
    const { eId } = req.params;

    const event = await Event.findByPk(eId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    else if (event.approved) {
      return res.status(400).json({ message: "Event already approved" });
    }

    event.approved = true;

    await event.save();

    res.status(200).json({ message: "Event approved successfully", event });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove an event by event_id
const removeEvent = async (req, res) => {
  try {
    const { eId } = req.params;
    const event = await Event.findByPk(eId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.destroy();
    res.status(200).json({ message: "Event removed successfully" });
  } catch (error) {
    console.error("Error removing event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllEvents, getEventById, approveEvent, removeEvent };
