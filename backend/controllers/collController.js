const Voucher = require("../models/Voucher");
const Website = require("../models/Website");
const ProductWebsite = require("../models/ProductWebsite");
const UserInteraction = require("../models/UserInteraction");
const UserVoucher = require("../models/UserVoucher");
const Event = require("../models/Event");
const User = require("../models/User");
const Product = require("../models/Product");

const getCollabProfile = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const website = await Website.findOne({
      where: {
        collabId: collabId,
      }
    });

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

    const websiteName = website.dataValues.name;

    const collab = await User.findOne({
      where: {
        userId: collabId,
      }
    });

    if(!collab){
      return res.status(404).json({message: "Collaboration profile not found"});
    }

    res.status(200).json({
      username: collab.dataValues.username,
      website: websiteName,
      email: collab.dataValues.email,
      registrationDate: collab.dataValues.registrationDate,
    });
  } catch (error) {
    console.error("Error getting collab profile: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getAllEvents = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const website = await Website.findOne({
      where:{
        UserUserId: collabId,
      }
    });

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

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

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

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

const getClickCounts = async (req, res) => {
  try {
    const { collabId } = req.params;

    const website = await Website.findOne({
      where: {
        UserUserId: collabId,
      },
    });

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

    const websiteId = website.websiteId;

    const productWebsites = await ProductWebsite.findAll({
      where: {
        WebsiteWebsiteId: websiteId,
      },
    });

    const pwIds = productWebsites.map((productWebsite) => productWebsite.pwId);

    const userInteractions = await UserInteraction.findAll({
      where: {
        pwId: pwIds,
      },
    });

    const clickcounts = {};
    userInteractions.forEach((interaction) => {
      if (!clickcounts[interaction.ProductWebsitePwId]) {
        clickcounts[interaction.ProductWebsitePwId] = {};
      }
      if (!clickcounts[interaction.ProductWebsitePwId][interaction.UserUserId]) {
        clickcounts[interaction.ProductWebsitePwId][interaction.UserUserId] = 0;
      }
      clickcounts[interaction.ProductWebsitePwId][interaction.UserUserId] += interaction.clickcount;
    });

    res.status(200).json({ clickcounts });
  } catch (error) {
    console.error("Error getting click counts:", error);
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

const assignVoucherToUser = async (req, res) => {
  try {
    const { userId, voucherId } = req.params;

    if (!userId || !voucherId) {
      return res.status(400).json({ message: "User ID and Voucher ID are required" });
    }

    const voucher = await Voucher.findByPk(voucherId);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    else if (voucher.total <= 0) {
      return res.status(400).json({ message: "No more vouchers available for this offer" });
    }

    const existingUserVoucher = await UserVoucher.findOne({
      where: {
        UserUserId: userId,
        VoucherVoucherId: voucherId,
        userId: userId,
        voucherId: voucherId
      }
    });

    if (existingUserVoucher) {
      return res.status(400).json({ message: "User already has this voucher" });
    }
    
    const newUserVoucher = await UserVoucher.create({
      UserUserId: userId,
      VoucherVoucherId: voucherId,
      userId: userId,
      voucherId: voucherId
    });

    voucher.total -= 1;

    await voucher.save();

    res.status(201).json({ message: "Voucher assigned to user successfully", newUserVoucher });
  } catch (error) {
    console.error("Error assigning voucher to user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const assignToRandomUsers = async (req, res) => {
  try {
    const { voucherId } = req.params;

    const voucher = await Voucher.findByPk(voucherId);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    else if (voucher.total <= 0) {
      return res.status(400).json({ message: "No more vouchers available for this offer" });
    }

    const users = await User.findAll();
    const userIds = users.map(user => user.userId);

    const usersWithoutVoucher = [];
    for (const userId of userIds) {
      const existingUserVoucher = await UserVoucher.findOne({
        where: {
          UserUserId: userId,
          VoucherVoucherId: voucherId,
          userId: userId,
          voucherId: voucherId
        }
      });
      if (!existingUserVoucher) {
        usersWithoutVoucher.push(userId);
      }
    }

    if (voucher.total >= usersWithoutVoucher.length) {
      await Promise.all(usersWithoutVoucher.map(async userId => {
        await UserVoucher.create({
          UserUserId: userId,
          VoucherVoucherId: voucherId,
          userId: userId,
          voucherId: voucherId
        });
      }));

      voucher.total -= usersWithoutVoucher.length;
      await voucher.save();

      res.status(201).json({ message: `Voucher assigned to ${usersWithoutVoucher.length} eligible users successfully` });
    } else {
      const selectedUserIds = [];
      while (selectedUserIds.length < voucher.total) {
        const randomIndex = Math.floor(Math.random() * usersWithoutVoucher.length);
        selectedUserIds.push(usersWithoutVoucher[randomIndex]);
        usersWithoutVoucher.splice(randomIndex, 1);
      }

      await Promise.all(selectedUserIds.map(async userId => {
        await UserVoucher.create({
          UserUserId: userId,
          VoucherVoucherId: voucherId,
          userId: userId,
          voucherId: voucherId
        });
      }));

      voucher.total -= selectedUserIds.length;
      await voucher.save();

      res.status(201).json({ message: `Voucher assigned to ${selectedUserIds.length} eligible users successfully` });
    }
  } catch (error) {
    console.error("Error assigning voucher to users:", error);
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

const getNumberOfUserVouchers = async (req, res) => {
  try {
    const { userId, collabId } = req.params;

    const website = await Website.findOne({
      where: {
        UserUserId: collabId,
      },
    });

    if (!website) {
      return res.status(404).json({ message: "Collaborated website not found" });
    }

    const websiteId = website.websiteId;

    const vouchers = await Voucher.findAll({
      where: {
        WebsiteWebsiteId: websiteId,
      },
    });

    const voucherIds = vouchers.map(voucher => voucher.voucherId);

    const userVouchers = await UserVoucher.findAll({
      where: {
        UserUserId: userId,
        VoucherVoucherId: voucherIds,
        userId: userId,
        voucherId: voucherIds
      },
    });

    const numberOfUserVouchers = userVouchers.length;

    res.status(200).json({ nVouchers: numberOfUserVouchers});
  } catch (error) {
    console.error("Error getting number of user vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

const getAllProducts = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const website = await Website.findOne({
      where: {
        collabId: collabId,
      }
    })

    if(!website)
    {
      res.status(404).json({ message: "Collaborated website not found" })
    }

    //console.log(website);
    const websiteId = website.dataValues.websiteId;
    //console.log(websiteId);

    const result = await ProductWebsite.findAll({
      where:
      {
        websiteId: websiteId,
      },
      include:
        [
          {
            model: Product,
          }
        ]
    })
    //console.log();
    res.status(200).json({ result, websiteId });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getClickCounts, addVoucher, assignVoucherToUser, assignToRandomUsers, removeVoucher, getAllVouchers, getNumberOfUserVouchers, addEvent, getAllEvents, updateEvent, removeEvent, getAllProducts, getCollabProfile };
