'use client';

interface ResourceSettingsProps {
  stonePrice: number;
  setStonePrice: (price: number) => void;
}

export function ResourceSettings({ stonePrice, setStonePrice }: ResourceSettingsProps) {
  return (
    <div className='bg-slate-900 rounded-lg p-4 border border-slate-700'>
      <h3 className='text-xl font-semibold mb-4 text-white'>재화 가격 설정</h3>

      <div className='space-y-4'>
        <div>
          <label htmlFor='stonePrice' className='block mb-2 text-slate-300'>
            정교한 강화석 가격 (골드)
          </label>
          <input
            id='stonePrice'
            type='number'
            min='1'
            value={stonePrice}
            onChange={(e) => setStonePrice(Number(e.target.value))}
            className='w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 text-white focus:outline-none focus:border-blue-500'
          />
        </div>
      </div>
    </div>
  );
}
