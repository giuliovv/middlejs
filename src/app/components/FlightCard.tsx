// src/app/components/FlightCard.tsx
import React from 'react';
import { CommonFlight } from '../types';
import { formatDuration } from '../utils/helpers';

interface FlightCardProps {
  flight: CommonFlight;
  index: number;
  city1?: string;
  city2?: string;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, index, city1, city2 }) => {
  const totalPrice = flight.flightFromCity1.price + flight.flightFromCity2.price;

  return (
    <div className="card p-4 mb-4 shadow-md border rounded-md">
      <h2 className="text-xl font-bold mb-2">Option {index + 1}</h2>
      <p className="mb-2">Common Destination: {flight.cityCodeTo}</p>
      
      <div className="mb-4">
        <h3 className="font-semibold">Round-trip flight details for {city1}:</h3>
        <p>Total Price: {totalPrice}€</p>
        <p>Departure: {flight.flightFromCity1.route[0].utc_departure}</p>
        <p>Duration: {formatDuration(flight.flightFromCity1.duration.departure)}</p>
        <p>Return: {flight.flightFromCity1.route[1].utc_departure}</p>
        <p>Duration: {formatDuration(flight.flightFromCity1.duration.return)}</p>
      </div>

      <div>
        <h3 className="font-semibold">Round-trip flight details for {city2}:</h3>
        <p>Total Price: {flight.flightFromCity2.price}€</p>
        <p>Departure: {flight.flightFromCity2.route[0].utc_departure}</p>
        <p>Duration: {formatDuration(flight.flightFromCity2.duration.departure)}</p>
        <p>Return: {flight.flightFromCity2.route[1].utc_departure}</p>
        <p>Duration: {formatDuration(flight.flightFromCity2.duration.return)}</p>
      </div>
    </div>
  );
};

export default FlightCard;
