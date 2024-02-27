const Event = require("../models/Event");
const Website = require("../models/Website");
const UserEvent = require("../models/UserEvent");
const { Op } = require("sequelize");

// Controller function to fetch user events
const getUserEvents = async (req, res) => {
  const userId = req.params.userId;

  try {
    const events = await UserEvent.findAll({
      where: {userId : userId },
      include: [
        {
          model: Event,
          attributes: ["eId", "name", "venue", "date", "description", "websiteId"],
          include: [
            {
              model: Website,
              attributes: ["name", "websiteId"],
            },
          ],
        },
      ],
      order: [[Event, 'date', 'ASC']],
    });

    const formatEvents = events.map((event) => {
      return {
        eId: event.Event.eId,
        eventName: event.Event.name,
        venue: event.Event.venue,
        date: event.Event.date,
        description: event.Event.description,
        websiteId: event.Event.Website.websiteId,
        websiteName: event.Event.Website.name
      };
    });

    res.json(formatEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  const userId = req.params.userId;

  try {
    const followedEvents = await UserEvent.findAll({
      where: { userId: userId },
      attributes: ['eId'],
    });

    const followedEventIds = followedEvents.map(event => event.dataValues.eId);
    console.log(followedEventIds);

    const upcomingEvents = await Event.findAll({
      where: { 
        date: { [Op.gt]: new Date() },
        eId: { [Op.notIn]: followedEventIds },
        approved: true
      },
      include: [
        {
          model: Website,
          attributes: ["name", "websiteId"],
        },
      ],
      order: [['date', 'ASC']],
    });

    const formatEvents = upcomingEvents.map((event) => {
      return {
        eId: event.eId,
        eventName: event.name,
        venue: event.venue,
        date: event.date,
        description: event.description,
        websiteId: event.websiteId,
        websiteName: event.Website.name
      };
    });

    res.json(formatEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const followEvent = async (req, res) => {
  const { userId, eId } = req.params;

  try {
    const existingEvent = await Event.findOne({
      where: { eId: eId, approved: true }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found or not approved" });
    }

    const existingEntry = await UserEvent.findOne({
      where: { userId: userId, eId: eId }
    });

    if (existingEntry) {
      return res.status(400).json({ error: "User is already following this event" });
    }

    await UserEvent.create({
      UserUserId: userId,
      EventEId: eId
    });

    const newEvent = await Event.findOne({
      where: { 
        eId: eId
      },
      include: [
        {
          model: Website,
          attributes: ["name", "websiteId"],
        },
      ],
    });

    const formatEvent = {
        eId: newEvent.eId,
        eventName: newEvent.name,
        venue: newEvent.venue,
        date: newEvent.date,
        description: newEvent.description,
        websiteId: newEvent.websiteId,
        websiteName: newEvent.Website.name
    };

    res.status(201).json({ message: "Event followed successfully", event: formatEvent});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const unfollowEvent = async (req, res) => {
  const { userId, eId } = req.params;

  try {
    const entryToDelete = await UserEvent.findOne({
      where: { userId: userId, eId: eId }
    });

    if (!entryToDelete) {
      return res.status(400).json({ error: "User is not following this event" });
    }

    await entryToDelete.destroy();

    const unfollowedEvent = await Event.findOne({
      where: { 
        eId: eId
      },
      include: [
        {
          model: Website,
          attributes: ["name", "websiteId"],
        },
      ],
    });

    const formatEvent = {
        eId: unfollowedEvent.eId,
        eventName: unfollowedEvent.name,
        venue: unfollowedEvent.venue,
        date: unfollowedEvent.date,
        description: unfollowedEvent.description,
        websiteId: unfollowedEvent.websiteId,
        websiteName: unfollowedEvent.Website.name
    };

    res.status(200).json({ message: "Event unfollowed successfully", event: formatEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserEvents, getUpcomingEvents, followEvent, unfollowEvent
};
