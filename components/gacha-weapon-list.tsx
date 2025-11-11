import { WeaponCategory } from '@/components/weapon-category';

export function GachaWeaponList() {
  return (
    <div className='mt-10'>
      <div className='text-center mb-12'>
        <h2 className='text-4xl sm:text-5xl font-extrabold text-white mb-3'>
          열쇠 뽑기
        </h2>
        <p className='text-slate-400 text-lg'>원하는 열쇠를 선택하세요</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* <WeaponCategory title='신비로운 열쇠' color='red' href='/gacha/mystery' /> */}
        <WeaponCategory title='영웅 열쇠' color='purple' href='/gacha/hero' />
        <WeaponCategory title='전설 열쇠' color='yellow' href='/gacha/legendary' />
      </div>
    </div>
  );
}
