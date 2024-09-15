import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import {GiConfirmed} from "react-icons/gi" ;
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const ManageReservations = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("access_token");

  const [reservations, setReservations] = useState([]);

  // Fetch reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/reservations", // Assuming endpoint for reservations
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "", // Add authorization header if needed
            },
          }
        );
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to fetch reservations",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    fetchReservations();
  }, []); // Empty dependency array to run only on component mount

  // Confirm reservation
  const confirmReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/reservations/accept/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", // Add authorization header if needed
          },
        }
      );
      const data = await response.json();
      console.log(data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reservation Confirmed!",
        showConfirmButton: false,
        timer: 1500,
      });
      // Refetch data after confirmation (optional)
      // fetchReservations();
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to confirm reservation",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Delete reservation
  const deleteReservation = (reservationId) => {
    Swal.fire({
      title: "Are you sure you want to delete this reservation?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const   
 response = await fetch(   

            `http://localhost:5000/reservations/${reservationId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "", // Add authorization header if needed
              },
            }
          );
          const data = await response.json();
          console.log(data);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Reservation Deleted!",
            showConfirmButton: false,
            timer: 1500,
          });
          // Refetch data after deletion (optional)
          // fetchReservations();
        } catch (error) {
          console.error(error);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to delete reservation",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div className="w-full md:w-[870px] mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">
        Manage All <span className="text-green">Reservations!</span>
      </h2>

      <div>
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
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
                  <td>{reservation.username}</td>
                  <td>{reservation.reservationDate}</td>
                  <td>{reservation.reservationTime}</td>
                  <td>{reservation.numberOfGuests}</td>
                  <td>{reservation.status}</td>
                  <td className="text-center">
                    {reservation.status === "pending" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => confirmReservation(reservation._id)}
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => deleteReservation(reservation._id)}
                      className="btn btn-ghost btn-xs"
                    >
                      <FaTrashAlt className="text-red"></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReservations;