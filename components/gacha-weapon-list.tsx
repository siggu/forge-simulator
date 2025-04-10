import { WeaponCategory } from '@/components/weapon-category';

export function GachaWeaponList() {
  return (
    <div className='mt-10'>
      <div className='flex justify-center text-3xl'>열쇠 뽑기</div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-10'>
        {/* <WeaponCategory title='신비로운 열쇠' color='red' href='/gacha/mystery' /> */}
        <WeaponCategory title='영웅 열쇠' color='purple' href='/gacha/hero' />
        <WeaponCategory title='전설 열쇠' color='yellow' href='/gacha/legendary' />
      </div>
    </div>
  );
}
