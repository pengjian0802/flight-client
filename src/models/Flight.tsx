export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  pricing: PricingOption[];
}

export interface PricingOption {
  type: string;
  price: number;
  description: string;
}    