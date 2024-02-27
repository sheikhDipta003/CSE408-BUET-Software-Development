const Voucher = require("../models/Voucher");
const Website = require("../models/Website");
const Event = require("../models/Event");

const getAllEvents = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const website = await Website.findOne({
      where:{
        UserUserId: collabId,
      }
    });

    const websiteId = website.dataValues.websiteId;

    const events = await Event.findAll({
      where:
      {
        WebsiteWebsiteId: websiteId,
      }
    });
    res.status(200).json({ events });

  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addEvent = async (req, res) => {
  try {
    const { name, venue, date, description, url, collabId } = req.body;
    const website = await Website.findOne({
      where:{
        UserUserId: collabId,
      }
    })

    const websiteId = website.dataValues.websiteId;

    const newEvent = await Event.create({
      name: name,
      venue: venue,
      date: date,
      description: description,
      url: url,
      WebsiteWebsiteId: websiteId,
    });

    res.status(201).json({ message: "Event added successfully\n", event: newEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eId, collabId } = req.params;
    const { name, venue, date, description, url } = req.body;

    const website = await Website.findOne({
      where: {
        UserUserId: collabId,
      },
    });

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

    const websiteId = website.websiteId;

    const event = await Event.findByPk(eId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.WebsiteWebsiteId !== websiteId) {
      return res.status(400).json({ message: "Event is not hosted by the collaboration with the given collabId" });
    }

    event.name = name;
    event.venue = venue;
    event.date = date;
    event.description = description;
    event.url = url;
    event.approved = false;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove an event by event_id
const removeEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId);
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

const addVoucher = async (req, res) => {
  try {
    // Extract voucher details from the request body
    const {
      voucherCode,
      discountPercentage,
      maxAmount,
      minAmount,
      endDate,
      total, 
      collabId
    } = req.body;

    const website = await Website.findOne({
      where:
      {
        UserUserId: collabId,
      }
    })

    const websiteId=website.dataValues.websiteId;

    // Create a new voucher in the database
    const newVoucher = await Voucher.create({
      WebsiteWebsiteId: websiteId,
      voucherCode: voucherCode,
      discountPercentage: discountPercentage,
      maxAmountForDiscount: maxAmount,
      minAmountForDiscount: minAmount,
      endDate: endDate,
      total: total
    });

    res.status(201).json({ newVoucher });
  } catch (error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVouchers = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const website = await Website.findOne({
      where:{
        UserUserId: collabId,
      }
    });

    if(!website)
    {
      res.status(404).json({ message: "Collaborated website not found" })
    }

    const websiteId = parseInt(website.dataValues.websiteId, 10);

    const vouchers = await Voucher.findAll({
      where:
      {
        websiteId: websiteId,
      }
    });
    res.status(200).json({ vouchers });
  } catch (error) {
    console.error("Error getting vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const removeVoucher = async (req, res) => {
    try {
      const voucherId = req.params.voucherId;
      const voucher = await Voucher.findByPk(voucherId);
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }
      await voucher.destroy();
      res.status(200).json({ message: "Voucher removed successfully" });
  }catch(error) {
    console.error("Error removing voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { addVoucher, removeVoucher, getAllVouchers, addEvent, getAllEvents, updateEvent, removeEvent };
