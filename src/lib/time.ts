const getCurrentTimeInSeconds = () => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return currentTimeInSeconds;
};

const oneWeekInSeconds = 60 * 60 * 24 * 7;

function calculateDaysBetweenDates(startDate: string, endDate: string): number {
  const dateParts1 = startDate.split('/');
  const dateParts2 = endDate.split('/');

  const start = new Date(
    parseInt(dateParts1[2]),
    parseInt(dateParts1[1]) - 1,
    parseInt(dateParts1[0]),
  );
  const end = new Date(
    parseInt(dateParts2[2]),
    parseInt(dateParts2[1]) - 1,
    parseInt(dateParts2[0]),
  );

  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return Math.abs(daysDifference);
}

export { getCurrentTimeInSeconds, oneWeekInSeconds, calculateDaysBetweenDates };
