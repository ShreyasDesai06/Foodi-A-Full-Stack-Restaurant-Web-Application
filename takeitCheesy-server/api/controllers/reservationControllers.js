const Reservation = require('../models/Reservation');
const verifyAdmin = require('../middlewares/verifyAdmin')
const verifyToken = require('../middlewares/verifyToken')

// Get all reservations (admin only)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific reservation by ID
const getReservation = async (req, res) => {
  const reservationId = req.params.id;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new reservation
const createReservation = async (req, res) => {
  const reservationData = req.body;
  reservationData.status = 'pending'; // Set initial status to pending

  try {
    const newReservation = await Reservation.create(reservationData);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update an entire reservation (admin only)
const updateReservation = async (req, res) => {
  const reservationId = req.params.id;
  const updatedReservationData = req.body;

  try {
    // Removed table availability check logic
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedReservationData,
      { new: true, runValidators: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updatedReservation);
  } catch   
 (error) {
    res.status(500).json({ message:   
 error.message });
  }
};

// Cancel a reservation
const cancelReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a reservation (admin only)
const acceptReservation = async (req, res) => {
    const reservationId = req.params.id;
  
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { status: 'confirmed' },
        { new: true }
      );
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.status(200).json({ message: 'Reservation accepted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a reservation (admin only)
  const deleteReservation = async (req, res) => {
    const reservationId = req.params.id;
  
    try {
      const reservation = await Reservation.findByIdAndDelete(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.status(204).send();   
   // No content response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  acceptReservation,
  deleteReservation,
};