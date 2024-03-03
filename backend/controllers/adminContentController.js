// adminContentController.js

const { exec } = require('child_process');
const express = require('express');
const router = express.Router();

const runScript = (req, res) => {
  try {
    exec('node ../scrapper/jsonToDB.cjs', (error, stdout, stderr) => {
      if (error) {
        console.error('Error running script:', error);
        res.status(500).json({ message: 'Error running script' });
        return;
      }
      console.log('Script executed successfully');
      res.status(200).json({ message: 'Script executed successfully' });
    });
  } catch (error) {
    console.error('Error running script:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { runScript };

