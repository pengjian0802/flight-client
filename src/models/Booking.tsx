import type { Flight, FlightSeat } from "./Flight";
import type { PayCard } from "./PayCard";
import type { User } from "./User";

export interface Booking {
  id: number | undefined;
  userId: number;
  flightId: number;
  payCardId: number;
  seatId: number | undefined;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  bookingTime: string;
  price: number | undefined;
  seatType: string;
  totalPrice: number;
}

export interface BookingDetail {
  id: number;
  user: User
  flight: Flight;
  seat: FlightSeat;
  payCard: PayCard;
  // Booking
  status: string;
  bookingTime: string;
  totalPrice: number;
}

export interface BookingRequest {
  bookingId: number | undefined;
  userId: number;
  flightId: number;
  seatId: number;
}
