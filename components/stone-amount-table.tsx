import { HERO_STONE_AMOUNTS, LEGENDARY_STONE_AMOUNTS } from '@/lib/reinforcement-constants';

interface StoneAmountTableProps {
  category: 'hero' | 'legendary' | 'mortal';
}

export function StoneAmountTable({ category }: StoneAmountTableProps) {
  const stoneAmounts = category === 'hero' ? HERO_STONE_AMOUNTS : LEGENDARY_STONE_AMOUNTS;

  return (
    <div className='bg-slate-900 rounded-lg p-4 mt-4 border border-slate-700'>
      <h3 className='text-lg font-semibold mb-2 text-white'>강화 단계별 필요 강화석</h3>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr>
              <th className='px-2 py-1 border-b border-slate-700 text-slate-300'>강화 단계</th>
              {stoneAmounts.map((_, index) => (
                <th key={index} className='px-2 py-1 border-b border-slate-700 text-slate-300'>
                  {index}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='px-2 py-1 border-b border-slate-700 text-slate-300'>필요 강화석</td>
              {stoneAmounts.map((amount, index) => (
                <td key={index} className='px-2 py-1 border-b border-slate-700 text-center text-white'>
                  {amount}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
