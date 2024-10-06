"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [seats, setSeats] = useState([]);
  const [requestedSeats, setRequestedSeats] = useState(1);
  const [message, setMessage] = useState("");

  // Initialize 80 seats in the coach
  useEffect(() => {
    const initialSeats = Array(80)
      .fill({})
      .map((_, i) => ({
        seat_id: i + 1,
        row_number: Math.floor(i / 7) + 1,
        status: "available",
      }));
    setSeats(initialSeats);
  }, []);

  // Handle booking logic
  const handleBooking = () => {
    // Validate the seat request
    if (requestedSeats > 7) {
      setMessage("You cannot book more than 7 seats at a time.");
      return;
    }

    let availableSeats = seats.filter((seat) => seat.status === "available");

    // Check if enough seats are available
    if (availableSeats.length < requestedSeats) {
      setMessage("Not enough seats available.");
      return;
    }

    const bookedSeats = [];
    let seatsToBook = requestedSeats;

    // Try to book seats in the same row first
    const seatRows = groupSeatsByRow(availableSeats);
    for (const row in seatRows) {
      const rowSeats = seatRows[row];
      if (rowSeats.length >= seatsToBook) {
        bookedSeats.push(...rowSeats.slice(0, seatsToBook));
        seatsToBook = 0;
        break;
      }
    }

    // If not enough in one row, book nearby seats
    if (seatsToBook > 0) {
      bookedSeats.push(...availableSeats.slice(0, seatsToBook));
    }

    // Mark seats as booked
    const updatedSeats = seats.map((seat) =>
      bookedSeats.some((s) => s.seat_id === seat.seat_id)
        ? { ...seat, status: "booked" }
        : seat
    );

    setSeats(updatedSeats);
    setMessage(`Seats booked: ${bookedSeats.map((s) => s.seat_id).join(", ")}`);
  };

  // Group seats by row
  const groupSeatsByRow = (availableSeats) => {
    return availableSeats.reduce((acc, seat) => {
      acc[seat.row_number] = acc[seat.row_number] || [];
      acc[seat.row_number].push(seat);
      return acc;
    }, {});
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Train Seat Booking System
      </h1>

      <div className="flex justify-center items-center mb-6">
        <label htmlFor="seats" className="mr-4 font-medium text-lg">
          Seats to Book:
        </label>
        <input
          type="number"
          id="seats"
          value={requestedSeats}
          onChange={(e) => setRequestedSeats(Number(e.target.value))}
          min={1}
          max={7}
          className="border rounded-lg p-2 text-lg text-black"
        />
        <button
          onClick={handleBooking}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Book Seats
        </button>
      </div>

      {message && (
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-red-500">{message}</p>
        </div>
      )}

      {/* Seat Grid */}
      <div className="grid grid-cols-7 gap-4 justify-center items-center">
        {seats.map((seat) => (
          <div
            key={seat.seat_id}
            className={`p-4 text-center border rounded-lg text-lg font-medium ${
              seat.status === "booked"
                ? "bg-red-400 text-white"
                : "bg-green-400 text-white"
            }`}
          >
            {seat.seat_id}
          </div>
        ))}
      </div>
    </div>
  );
}
