// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import FlightCard from './components/FlightCard';

// Add these imports at the top
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const cities = ['ZRH', 'LON', 'VIE', 'MAD', 'VCE', 'BLQ'];

const HomePage: React.FC = () => {
  const router = useRouter();
  
  const [selectedCity1, setSelectedCity1] = useState<string | undefined>();
  const [selectedCity2, setSelectedCity2] = useState<string | undefined>();
  const [isSelectedDeparture, setIsSelectedDeparture] = useState<boolean[]>(Array(7).fill(false));
  const [isSelectedReturn, setIsSelectedReturn] = useState<boolean[]>(Array(7).fill(false));
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleDayToggle = (
    index: number, 
    isSelected: boolean[], 
    setIsSelected: React.Dispatch<React.SetStateAction<boolean[]>>
  ) => {
    const updated = [...isSelected];
    updated[index] = !updated[index];
    setIsSelected(updated);
  };

  const handleSearch = () => {
    if (!selectedCity1 || !selectedCity2 || !dateRange?.from || !dateRange.to) {
      alert("Please select both cities and a date range.");
      return;
    }
  
    const query = new URLSearchParams({
      city1: selectedCity1,
      city2: selectedCity2,
      departureDays: JSON.stringify(isSelectedDeparture),
      returnDays: JSON.stringify(isSelectedReturn),
      dateFrom: dateRange.from.toISOString(),
      dateTo: dateRange.to.toISOString(),
    }).toString();
  
    router.push(`/search-result?${query}`);
  };
  

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <Image src="/images/icon.png" alt="Icon" width={100} height={100} />
        <h1 className="text-3xl font-bold">Meet Halfway</h1>
        <p className="text-lg">Find the best meeting point!</p>
      </header>

      <div className="space-y-6">
        <div>
          <label className="block mb-2">Your City</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedCity1}
            onChange={(e) => setSelectedCity1(e.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Friend's City</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedCity2}
            onChange={(e) => setSelectedCity2(e.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="mb-2">Departure Days</h3>
          <div className="flex space-x-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <button
                key={day}
                className={`px-4 py-2 border rounded ${isSelectedDeparture[index] ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleDayToggle(index, isSelectedDeparture, setIsSelectedDeparture)}
                aria-pressed={isSelectedDeparture[index]}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2">Return Days</h3>
          <div className="flex space-x-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <button
                key={day}
                className={`px-4 py-2 border rounded ${isSelectedReturn[index] ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => handleDayToggle(index, isSelectedReturn, setIsSelectedReturn)}
                aria-pressed={isSelectedReturn[index]}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Select Date Range</label>
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={handleDateChange}
          />
        </div>

        <div>
          <button
            className="w-full bg-green-500 text-white py-2 rounded"
            onClick={handleSearch}
            disabled={!selectedCity1 || !selectedCity2 || !dateRange?.from || !dateRange.to}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
