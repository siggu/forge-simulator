interface ResourceCounterProps {
  usedStones: number;
  totalCost: number;
  stonePrice: number;
}

const formatCurrency = (amount: number) => {
  if (amount >= 100_000_000) {
    return `${Math.floor(amount / 100_000_000)}억 ${Math.floor((amount % 100_000_000) / 10_000_000)}천만`;
  }
  if (amount >= 10_000_000) {
    return `${Math.floor(amount / 10_000_000)}천만 ${Math.floor((amount % 10_000_000) / 1_000_000)}백만`;
  }
  if (amount >= 1_000_000) {
    return `${Math.floor(amount / 1_000_000)}백만 ${Math.floor((amount % 1_000_000) / 10_000)}만원`;
  }
  if (amount >= 10_000) {
    return `${Math.floor(amount / 10_000)}만원 ${amount % 10_000}원`;
  }
  return `${amount}원`;
};

export function ResourceCounter({ usedStones, totalCost, stonePrice }: ResourceCounterProps) {
  return (
    <div className='bg-gray-700 rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-2'>소모한 재화</h3>
      <div className='space-y-1'>
        <p>
          정교한 강화석: {usedStones}개 ({usedStones * stonePrice} 골드)
        </p>
        <p className='text-xl mt-2'>
          총 비용: <span className='font-bold'>{formatCurrency(totalCost)}</span> 골드
        </p>
      </div>
    </div>
  );
}
