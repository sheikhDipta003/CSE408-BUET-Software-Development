const Voucher = require('../models/Voucher');


const addVoucher = async (req, res) => {
    try {
      // Extract voucher details from the request body
      const { websiteId, voucherCode, discountPercentage, maxAmount, minAmount, endDate } = req.body;

      // Create a new voucher in the database
      const newVoucher = await Voucher.create({
        websiteId:websiteId,
        voucherCode:voucherCode,
        discountPercentage:discountPercentage,
        maxAmount:maxAmount,
        minAmount:minAmount,
        endDate:endDate,
      });

      res.status(201).json({ newVoucher });
    } catch (error) {
      console.error('Error adding voucher:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Endpoint to delete a voucher
const deleteVoucher = async (req, res) => {
    try {
      const voucherId = req.params.voucherId;

      const voucher = await Voucher.findOne({where: {voucherId: voucherId}});
      
      if(!voucher){
        return res.status(404).json({ message: 'Voucher not found' });
      }
      res.status(200).json({ message: 'Voucher deleted successfully' });
    } catch (error) {
      console.error('Error deleting voucher:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Endpoint to view all vouchers
const viewAllVouchers = async (req, res) => {
    try {
      // Fetch all vouchers from the database
      const allVouchers = await Voucher.findAll({
        include: [
          {
            model: Website,
            attributes: ['name', 'url'], // Add other website attributes as needed
          },
        ],
        order: [
          // Order by website name in ascending order
          [{ model: Website }, 'name', 'ASC'],
        ],
      });

      res.status(200).json({ allVouchers });
    } catch (error) {
      console.error('Error retrieving all vouchers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Endpoint to view a specific voucher
const viewOneVoucher = async (req, res) => {
    try {
      const voucherId = req.params.voucherId;

      // Fetch the specific voucher from the database
      const voucher = await Voucher.findByPk(voucherId, {
        include: [
          {
            model: Website,
            attributes: ['name', 'url'], // Add other website attributes as needed
          },
        ],
      });

      if (!voucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }

      res.status(200).json({ voucher });
    } catch (error) {
      console.error('Error retrieving voucher:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {addVoucher, deleteVoucher, viewAllVouchers, viewOneVoucher};
