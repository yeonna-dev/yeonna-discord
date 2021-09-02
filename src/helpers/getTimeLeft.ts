export function getTimeLeft(milliseconds: any)
{
  const suffix = (amount: number | string) => amount !== 1 ? 's' : '';

  const rawSeconds = milliseconds / 1000;
  if(milliseconds < 60000)
  {
    const seconds = milliseconds >= 1000 ? Math.floor(rawSeconds) : rawSeconds.toFixed(2);
    return `${seconds} second${suffix(seconds)}`;
  }

  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const seconds = Math.ceil((rawSeconds) % 60);

  let timeLeft = `${(rawSeconds).toFixed(2)} second${suffix(milliseconds)}`;
  if(seconds > 0)
    timeLeft = `${seconds} second${suffix(seconds)}`;
  if(minutes > 0)
    timeLeft = `${minutes} minute${suffix(minutes)} and ` + timeLeft;
  if(hours > 0)
    timeLeft = `${hours} hour${suffix(hours)}, ` + timeLeft;

  return timeLeft;
}
