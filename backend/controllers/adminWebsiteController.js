const Website = require('../models/Website');

  // Endpoint to add a new website
const addWebsite = async (req, res) => {
    try {
      // Extract website details from the request body
      const { name, url, collaboration } = req.body;

      // Create a new website in the database
      const newWebsite = await Website.create({ name:name, url:url, collaboration:collaboration });

      res.status(201).json({ website: newWebsite });
    } catch (error) {
      console.error('Error adding website:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Endpoint to delete a website
const deleteWebsite = async (req, res) => {
    try {
      const websiteId = req.params.websiteId;

      const website = await Website.findOne({where: {websiteId: websiteId}});

      if(!website){
        return res.status(404).json({ message: 'Website not found' });
      }

      await website.destroy();

      res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
      console.error('Error deleting website:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Endpoint to update website data
const updateWebsite = async (req, res) => {
    try {
      const websiteId = req.params.websiteId;

      // Fetch the specific website from the database
      const website = await Website.findByPk(websiteId);

      if (!website) {
        return res.status(404).json({ message: 'Website not found' });
      }

      // Extract updated website data from the request body
      const { name, url, collaboration } = req.body;

      // Update the website data in the database
      await website.update({ name, url, collaboration });

      res.status(200).json({ message: 'Updated Successfully', website });
    } catch (error) {
      console.error('Error updating website:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const viewAllWebsites = async (req, res) => {
    try {
      // Fetch all websites from the database
      const allWebsites = await Website.findAll();

      res.status(200).json({ allWebsites });
    } catch (error) {
      console.error('Error retrieving all websites:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {addWebsite, deleteWebsite, updateWebsite, viewAllWebsites};
