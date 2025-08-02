export interface YieldInput {
  principal: number;
  depositTimestamp: number;
  interestPercent: number;
  currentTimestamp?: number;
  compounding?: boolean;
}

export function calculateYield({
  principal,
  depositTimestamp,
  interestPercent,
  currentTimestamp = Math.floor(Date.now() / 1000),
  compounding = true,
}: YieldInput): number {
  const secondsPassed = currentTimestamp - depositTimestamp;
  if (secondsPassed <= 0) return 0;

  const dailyRate = interestPercent / 100;
  const secondsInDay = 86400;
  const ratePerSecond = dailyRate / secondsInDay;

  let yieldAmount = 0;

  if (compounding) {
    const amount = principal * Math.pow(1 + ratePerSecond, secondsPassed);
    yieldAmount = amount - principal;
  } else {
    yieldAmount = principal * ratePerSecond * secondsPassed;
  }

  return parseFloat(yieldAmount.toFixed(6));
}
