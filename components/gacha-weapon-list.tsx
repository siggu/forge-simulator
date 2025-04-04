import { WeaponCategory } from '@/components/weapon-category';

export function GachaWeaponList() {
  return (
    <div className='mt-10'>
      <div className='flex justify-center text-3xl'>무기 뽑기</div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
        <WeaponCategory title='희귀 무기' color='blue' href='/gacha/rare' />
        <WeaponCategory title='영웅 무기' color='purple' href='/gacha/hero' />
        <WeaponCategory title='전설 무기' color='yellow' href='/gacha/legendary' />
      </div>
    </div>
  );
}
