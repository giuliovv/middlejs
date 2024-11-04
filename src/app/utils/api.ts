// src/app/utils/api.ts
import axios from 'axios';
import { formatDate, createDayString } from './helpers';

const TEQUILA_ENDPOINT = "https://api.tequila.kiwi.com/v2/search";
const TEQUILA_API_KEY = process.env.NEXT_PUBLIC_TEQUILA_API_KEY;

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

export const fetchResults = async (
  flyFrom: string,
  cities: string[],
  dateRange: { start: Date; end: Date },
  selectedDepartureDays: boolean[],
  selectedReturnDays: boolean[]
): Promise<FlightResult[]> => {
  const formattedDateFrom = formatDate(dateRange.start);
  const formattedDateTo = formatDate(dateRange.end);
  const departureDayString = createDayString(selectedDepartureDays);
  const returnDayString = createDayString(selectedReturnDays);
  
  const flyToCities = cities.map(city => `city:${city}`).join(',');

  const params = {
    fly_from: `city:${flyFrom}`,
    fly_to: flyToCities,
    date_from: formattedDateFrom,
    date_to: formattedDateTo,
    return_from: formattedDateFrom,
    return_to: formattedDateTo,
    nights_in_dst_from: "1",
    nights_in_dst_to: "7",
    adults: "1",
    children: "0",
    infants: "0",
    max_stopovers: "2",
    curr: "EUR",
    max_fly_duration: "3",
    fly_days: departureDayString,
    ret_fly_days: returnDayString
  };

  const response = await axios.get(TEQUILA_ENDPOINT, {
    headers: {
      apikey: TEQUILA_API_KEY || '',
    },
    params,
  });

  if (response.status === 200) {
    return response.data.data;
  } else {
    throw new Error('Failed to fetch data');
  }
};
