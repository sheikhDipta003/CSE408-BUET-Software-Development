const User = require('../models/User'); // Adjust the import path based on your actual project structure

const getUsers = async (req, res) => {
    try {
      // Fetch the list of users from the database
      const users = await User.findAll({
        where: {roles: ['User', 'Collaborator']},
        attributes: ['userId', 'username', 'email', 'roles'],
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getOneUser = async(req, res) => {
    try {
        const userId = req.params.userId;
        // Fetch the list of users from the database
        const user = await User.findOne({
          where: {userId: userId},
          attributes: ['userId', 'username', 'email', 'roles'],
        });

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({ user });
      } catch (error) {
        console.error('Error retrieving user: ', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  }

  // Endpoint to delete a user by ID
const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;

      // Check if the user exists
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete the user
      await user.destroy();

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {getUsers, deleteUser, getOneUser};