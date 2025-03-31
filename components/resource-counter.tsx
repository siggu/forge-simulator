interface ResourceCounterProps {
  usedStones: number;
  totalCost: number;
  stonePrice: number;
}

export function ResourceCounter({ usedStones, totalCost, stonePrice }: ResourceCounterProps) {
  return (
    <div className='bg-gray-700 rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-2'>소모한 재화</h3>
      <div className='space-y-1'>
        <p>
          정교한 강화석: {usedStones}개 ({usedStones * stonePrice} 골드)
        </p>
        <p className='text-xl mt-2'>
          총 비용: <span className='font-bold'>{totalCost}</span> 골드
        </p>
      </div>
    </div>
  );
}
