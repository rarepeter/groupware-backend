const getCurrentTimeInSeconds = () => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return currentTimeInSeconds;
};

const oneWeekInSeconds = 60 * 60 * 24 * 7;

export { getCurrentTimeInSeconds, oneWeekInSeconds };
