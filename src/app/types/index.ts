// src/app/types/index.ts
export interface FlightResult {
    price: number;
    cityCodeTo: string;
    local_departure: string;
    local_arrival: string;
    duration: {
      departure: number;
      return: number;
    };
    route: Array<{
      utc_departure: string;
    }>;
  }
  
  export interface CommonFlight {
    cityCodeTo: string;
    totalPriceFromCity1: number;
    totalPriceFromCity2: number;
    combinedPrice: number;
    flightFromCity1: FlightResult;
    flightFromCity2: FlightResult;
  }