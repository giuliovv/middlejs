// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <header className="text-center mb-6">
          <Image src="/images/icon.png" alt="Icon" width={80} height={80} className="mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Meet Halfway</h1>
          <p className="text-gray-600">Find the best meeting point!</p>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Your City</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block mb-1 font-semibold">Friend's City</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <h3 className="mb-1 font-semibold">Departure Days</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <button
                  key={day}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    isSelectedDeparture[index] ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onClick={() => handleDayToggle(index, isSelectedDeparture, setIsSelectedDeparture)}
                  aria-pressed={isSelectedDeparture[index]}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold">Return Days</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <button
                  key={day}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    isSelectedReturn[index] ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onClick={() => handleDayToggle(index, isSelectedReturn, setIsSelectedReturn)}
                  aria-pressed={isSelectedReturn[index]}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Select Date Range</label>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={1}
              modifiersClassNames={{
                selected: 'bg-blue-500 text-white',
                from: 'bg-blue-500 text-white',
                to: 'bg-blue-500 text-white',
              }}
              className="rounded-md overflow-hidden shadow-inner"
            />
          </div>

          <div>
            <button
              className={`w-full py-2 rounded-md text-white font-semibold ${
                selectedCity1 && selectedCity2 && dateRange?.from && dateRange.to
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-green-300 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              onClick={handleSearch}
              disabled={!selectedCity1 || !selectedCity2 || !dateRange?.from || !dateRange.to}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
