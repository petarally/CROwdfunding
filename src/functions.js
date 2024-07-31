// functions.js
export function calculateDaysLeft(startDate, endDate) {
  if (!startDate || !endDate) {
    console.error("Invalid startDate or endDate:", startDate, endDate);
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    console.error("Invalid date objects:", start, end);
    return 0;
  }

  const timeDifference = end.getTime() - start.getTime();
  console.log("Time Difference (ms):", timeDifference);

  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
  console.log("Days Left:", daysLeft);

  return daysLeft;
}
