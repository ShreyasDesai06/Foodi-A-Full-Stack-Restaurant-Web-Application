import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.email || loading) return; // Skip fetching if user is not available or loading

      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/reservations?email=${user?.email}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Failed to fetch reservations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [user?.email, loading]); // Re-fetch on user change or loading status

  const handleCreateReservation = () => {
    navigate("/create-reservation");
  };

  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString(); // Adjust options as needed
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData?.message || "An error occurred while canceling.";
        throw new Error(errorMessage);
      }

      const updatedReservations = reservations.filter(
        (reservation) => reservation._id !== reservationId
      );
      setReservations(updatedReservations);
      alert("Reservation canceled successfully!");
    } catch (error) {
      console.error("Error canceling reservation:", error);
      setError("Failed to cancel reservation. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* Content */}
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Manage Your Reservations
            </h2>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className="btn btn-primary mb-4"
        onClick={handleCreateReservation}
      >
        Create New Reservation
      </button>

      {/* Table content */}
      <div>
        {isLoading ? (
          <p className="text-center">Loading reservations...</p>
        ) : error ? (
          <p className="text-center">Error loading reservations: {error}</p>
        ) : (
          <div>
            {reservations.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="table text-center">
                    {/* Table header */}
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{formatDate(reservation.reservationDate)}</td>
                          <td>{reservation.reservationTime}</td>
                          <td>{reservation.numberOfGuests}</td>
                          <td>{reservation.status}</td>
                          <td>
                            {/* Replace with appropriate actions based on reservation status (e.g., view details, cancel) */}
                            <button
                              className="btn btn-sm border-none text-orange-400 bg-transparent"
                              onClick={() =>
                                handleCancelReservation(reservation._id)
                              }
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                You don't have any reservations yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
