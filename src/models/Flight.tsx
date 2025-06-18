export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  aircraft: string;
  seats: FlightSeat[];
}

export interface FlightSeat {
  id: string;
  seatType: string;
  seatNumber: string;
  price: number;
  isAvailable: boolean;
}    

export interface QueryFlightListRequest {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  passengers: number;
}
