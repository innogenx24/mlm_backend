// routes/sectorRoutes.js
const express = require('express');
const sectorController = require('../controllers/sector_controller/sectorController');

const router = express.Router();

// CRUD routes
router.post('/', sectorController.createSector); // Create a sector
router.get('/', sectorController.getSectors); // Get all sectors
router.get('/:id', sectorController.getSectorById); // Get a sector by ID
router.put('/:id', sectorController.updateSector); // Update a sector
router.delete('/:id', sectorController.deleteSector); // Delete a sector

module.exports = router;