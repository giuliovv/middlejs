// src/app/utils/helpers.ts
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  export const createDayString = (selectedDays: boolean[]): string => {
    if (selectedDays.every(day => !day)) return "0,1,2,3,4,5,6";
    
    return selectedDays
      .map((selected, index) => (selected ? (index + 1) % 7 : null))
      .filter((val): val is number => val !== null)
      .join(',');
  };
  
  export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  