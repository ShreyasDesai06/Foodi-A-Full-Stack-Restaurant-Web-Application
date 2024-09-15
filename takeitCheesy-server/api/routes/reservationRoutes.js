const express = require('express');
const router = express.Router();
const reservationControllers = require('../controllers/reservationControllers');

const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Get all reservations (admin only)
router.get('/', verifyToken, verifyAdmin, reservationControllers.getAllReservations);

// Get a specific reservation by ID
router.get('/:id', verifyToken, reservationControllers.getReservation);

// Create a new reservation
router.post('/', verifyToken, reservationControllers.createReservation);

// Update a reservation (admin only)
router.put('/:id', verifyToken, verifyAdmin, reservationControllers.updateReservation);

// Cancel a reservation
router.delete('/:id', verifyToken, reservationControllers.cancelReservation);

// Accept a reservation
router.put('/accept/:id', verifyToken, verifyAdmin, reservationControllers.acceptReservation);

// Delete a reservation
router.delete('/:id', verifyToken, verifyAdmin, reservationControllers.deleteReservation);

module.exports = router;