// src/app/search-result/page.tsx
"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchResults, FlightResult } from '../utils/api';
import { CommonFlight } from '../types';
import FlightCard from '../components/FlightCard';
import { formatDuration } from '../utils/helpers';

const SearchResultContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didFetch = useRef(false);

  const city1 = searchParams.get('city1') || '';
  const city2 = searchParams.get('city2') || '';
  const departureDays = searchParams.get('departureDays') ? JSON.parse(searchParams.get('departureDays')!) : [];
  const returnDays = searchParams.get('returnDays') ? JSON.parse(searchParams.get('returnDays')!) : [];
  const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
  const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

  const [commonFlights, setCommonFlights] = useState<CommonFlight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const getFlights = async () => {
      if (!city1 || !city2 || departureDays.length === 0 || returnDays.length === 0 || !dateFrom || !dateTo) {
        setError('Missing query parameters');
        setLoading(false);
        return;
      }

      try {
        // Define all cities excluding city1 and city2
        let allCities = [
          'LON', 'CDG', 'FRA', 'AMS', 'MAD', 'BCN', 'MUC', 'FCO',
          'LGW', 'DME', 'SVO', 'ORY', 'ZRH', 'CPH', 'OSL', 'ARN',
          'DUB', 'BRU', 'VIE', 'MAN', 'ATH', 'LIS', 'HEL', 'IST',
          'SAW', 'PRG', 'BUD', 'WAW', 'HAM', 'EDI', 'MXP'
        ];
        allCities = allCities.filter(city => city !== city1 && city !== city2);

        // Split into chunks
        const chunkSize = Math.ceil(allCities.length / 3);
        const cityChunks = [];
        for (let i = 0; i < allCities.length; i += chunkSize) {
          cityChunks.push(allCities.slice(i, i + chunkSize));
        }

        // Fetch results for each chunk
        const allResults: FlightResult[] = [];
        const fetchPromises = cityChunks.flatMap(chunk => [
          fetchResults(city1, chunk, { start: dateFrom, end: dateTo }, departureDays, returnDays),
          fetchResults(city2, chunk, { start: dateFrom, end: dateTo }, departureDays, returnDays)
        ]);

        const responses = await Promise.all(fetchPromises);
        responses.forEach(response => {
          allResults.push(...response);
        });

        // Process common flights
        const commonFlightsMap: { [key: string]: CommonFlight } = {};

        allResults.forEach(result1 => {
          allResults.forEach(result2 => {
            if (
              result1.cityCodeTo === result2.cityCodeTo &&
              result1.local_arrival.split('T')[0] === result2.local_arrival.split('T')[0]
            ) {
              const pairIdentifier = `${result1.cityCodeTo}-${result1.local_departure.split('T')[0]}`;
              const combinedPrice = result1.price + result2.price;

              if (!commonFlightsMap[pairIdentifier] || commonFlightsMap[pairIdentifier].combinedPrice > combinedPrice) {
                commonFlightsMap[pairIdentifier] = {
                  cityCodeTo: result1.cityCodeTo,
                  totalPriceFromCity1: result1.price,
                  totalPriceFromCity2: result2.price,
                  combinedPrice,
                  flightFromCity1: result1,
                  flightFromCity2: result2,
                };
              }
            }
          });
        });

        const commonFlightsList = Object.values(commonFlightsMap);
        // Sort and take top 5
        commonFlightsList.sort((a, b) => a.combinedPrice - b.combinedPrice);
        setCommonFlights(commonFlightsList.slice(0, 5));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    getFlights();
  }, [city1, city2, departureDays, returnDays, dateFrom, dateTo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (commonFlights.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No combinations found :( Try a different date range. Less broad is sometimes better.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
      </header>
      {commonFlights.map((flight, index) => (
        <FlightCard
          key={index}
          flight={flight}
          index={index}
          city1={city1}
          city2={city2}
        />
      ))}
    </div>
  );
};

const SearchResultPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <SearchResultContent />
    </Suspense>
  );
};

export default SearchResultPage;
