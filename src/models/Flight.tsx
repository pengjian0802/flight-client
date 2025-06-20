export interface Flight {
  id: number;
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
  priceMap: Record<string, number>;
}

export interface FlightDetail {
  id: number;
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
  id: number;
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
