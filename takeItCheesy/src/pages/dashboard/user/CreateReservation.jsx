import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

const CreateReservation = () => {
  const token = localStorage.getItem("access_token");
  console.log('Token:', token);
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationTime: "",
    numberOfGuests: "",
    customerEmail: "",
    customerPhone: "",
    customerName: "",
    // Removed tablePreference field as it's no longer required
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.reservationDate || !formData.reservationTime || !formData.numberOfGuests ||
        !formData.customerEmail || !formData.customerPhone || !formData.customerName) {
      setError("Please fill in all required fields: date, time, number of guests, customer email, customer phone, and customer name.");
      return;
    }

    // Validate reservationTime format
    const reservationTimeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!reservationTimeRegex.test(formData.reservationTime)) {
      setError("Invalid reservation time format. Please use HH:MM (e.g., 15:30).");
      return;
    }

    // Convert reservationTime to a Date object
    const reservationDateTime = new Date(`<span class="math-inline">\{formData\.reservationDate\}T</span>{formData.reservationTime}:00`);

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token'); // Replace with your token storage mechanism

      if (!token) {
        console.error('Token not found in localStorage');
        setError('Token not found. Please login.');
        return;
      }

      const response = await fetch('http://localhost:5000/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          reservationTime: reservationDateTime
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        const errorMessage = errorData?.message || 'An error occurred';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Reservation created:', data);
      setIsLoading(false);
      alert('Reservation created successfully!');
      navigate('/reservations'); // Redirect to reservations page
    } catch (error) {
      console.error('Error creating reservation:', error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto mt-24">
      <h2 className="text-center text-4xl font-bold my-8">
        Create New Reservation
      </h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Reservation form elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reservationDate">Date:</label>
            <input
              type="date"
              id="reservationDate"
              name="reservationDate"
              value={formData.reservationDate}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          <div>
            <label htmlFor="reservationTime">Time:</label>
            <input
              type="time"
              id="reservationTime"
              name="reservationTime"
              value={formData.reservationTime}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          <div>
            <label htmlFor="numberOfGuests">Number of Guests:</label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          <div>
            <label htmlFor="customerEmail">Customer Email:</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          <div>
            <label htmlFor="customerPhone">Customer Phone:</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          <div>
            <label htmlFor="customerName">Customer Name:</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="input input-bordered w-full" // Add class from AddMenu
            />
          </div>
          {/* Removed tablePreference field */}
        </div>
        <div>{/* Display available tables or table selection options (optional) */}</div>
        <button type="submit" className="btn bg-green text-white px-6">
          {isLoading ? "Creating reservation..." : "Create Reservation"}
          <FaUtensils />
        </button>
      </form>
    </div>
  );
};

export default CreateReservation;