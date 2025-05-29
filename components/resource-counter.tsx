interface ResourceCounterProps {
  usedStones: number;
  totalCost: number;
  stonePrice: number;
}

function formatKoreanCurrency(num: number): string {
  if (num === 0) return '0';

  const units = ['억', '천만', '백만', '십만', '만', '천', '백', '십', ''];
  const unitValues = [100000000, 10000000, 1000000, 100000, 10000, 1000, 100, 10, 1];
  const result = [];

  for (let i = 0; i < unitValues.length; i++) {
    const unitValue = unitValues[i];
    const unit = units[i];
    const digit = Math.floor(num / unitValue);
    if (digit > 0) {
      result.push(`${digit}${unit}`);
      num %= unitValue;
    }
  }

  return result.join(' ');
}

export function ResourceCounter({ usedStones, totalCost, stonePrice }: ResourceCounterProps) {
  return (
    <div className='bg-zinc-700 rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-2'>소모한 재화</h3>
      <div className='space-y-1'>
        <p>
          정교한 강화석: {usedStones}개 ({usedStones * stonePrice} 골드)
        </p>
        <p className='text-xl mt-2'>
          총 비용: <span className='font-bold'>{formatKoreanCurrency(totalCost)}</span> 골드
        </p>
      </div>
    </div>
  );
}
