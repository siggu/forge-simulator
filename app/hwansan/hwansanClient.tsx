'use client';

import { destinyItems, items, jobItems } from '@/lib/items';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  GUILD_BASE_MULTIPLIER,
  GUILD_STAT_MULTIPLIER,
  STAT_DAMAGE_MULTIPLIER,
  FINAL_DPM_MULTIPLIER,
} from '@/constants/damage-multipliers';
import { calculateAllJobWeaponDPMs } from '@/utils/dpm-calculator';

const heroItems = items.filter((item) => item.category === 'hero');
const legendaryItems = items.filter((item) => item.category === 'legendary');
const mortalItems = items.filter((item) => item.category === 'mortal');

const specialWeaponGroups = [
  { title: '영웅 무기', items: heroItems, color: 'purple' },
  { title: '전설 무기', items: legendaryItems, color: 'yellow' },
  { title: '필멸 무기', items: mortalItems, color: 'red' },
];

export default function HwansanClient() {
  // 직업 무기 레벨
  const [jobWeaponLevels, setJobWeaponLevels] = useState<Record<string, number>>({});

  // 특수 무기 레벨
  const [specialWeaponLevels, setSpecialWeaponLevels] = useState<Record<string, number>>({});

  // 운명 무기 각성 체크 여부
  const [destinyAwakenings, setDestinyAwakenings] = useState<Record<string, number>>({});

  // 추가 입력값들
  const [bossAdditionalDamage, setBossAdditionalDamage] = useState('');
  const [guildAdditionalDamage, setGuildAdditionalDamage] = useState('');
  const [damageStat, setDamageStat] = useState('');
  const [divineShardDamage, setDivineShardDamage] = useState('');
  const [manaPool, setManaPool] = useState('');

  // 마나 상태 관리
  const [selectedWeapons, setSelectedWeapons] = useState<
    { weaponId: string; weaponName: string; level: number; activationRate: number; dpm: number; efficiency?: number }[]
  >([]);
  const [remainingAvailability, setRemainingAvailability] = useState<number>(0);

  // 플레이어 가동률 계산
  const playerAvailability = useMemo(() => {
    const mana = Number(manaPool);
    return (2 + mana / 100) * 60 + mana / 10;
  }, [manaPool]);

  // 마나 변경 시 초기화
  useEffect(() => {
    setRemainingAvailability(playerAvailability);
    setSelectedWeapons([]);
  }, [playerAvailability]);

  // DPM -> 60/쿨타임*표기딜
  const jobWeaponDPMs = useMemo(() => {
    return calculateAllJobWeaponDPMs(jobWeaponLevels, jobItems);
  }, [jobWeaponLevels]);

  const handleWeaponSelection = (weaponId: string, level: number) => {
    const item = items.find((i) => i.id === weaponId);
    const damageInfo = item?.damages?.[level];
    const times = item?.times;

    if (!item || !damageInfo) return;

    const { cooldown, mana: manaCost, damage } = damageInfo;

    // 가동률 계산
    const activationRate = (60 / cooldown) * manaCost;

    // DPM 계산
    const dpm = (60 / cooldown) * damage * (times ?? 1);

    // 기존 무기가 선택된 경우 처리
    const existingWeaponIndex = selectedWeapons.findIndex((w) => w.weaponId === weaponId);

    if (existingWeaponIndex !== -1) {
      // 기존 무기의 가동률 복구
      const existingWeapon = selectedWeapons[existingWeaponIndex];
      setRemainingAvailability((prev) => prev + existingWeapon.activationRate);

      // 무기 레벨 업데이트 및 가동률 재계산
      const updatedWeapons = [...selectedWeapons];
      updatedWeapons[existingWeaponIndex] = {
        weaponId,
        weaponName: item.name,
        level,
        activationRate,
        dpm, // DPM 추가
      };
      setSelectedWeapons(updatedWeapons);

      // 남은 가동률 업데이트
      setRemainingAvailability((prev) => prev - activationRate);
    } else {
      // 새로운 무기 추가
      const newRemainingAvailability = remainingAvailability - activationRate;

      if (newRemainingAvailability >= 0) {
        // 가동률이 충분하면 무기 추가
        setSelectedWeapons((prev) => [
          ...prev,
          { weaponId, weaponName: item.name, level, activationRate, dpm }, // DPM 추가
        ]);
        setRemainingAvailability(newRemainingAvailability);
      } else {
        // 가동률이 부족하면 환산 계산
        const efficiency = remainingAvailability * ((damage * (times ?? 1)) / manaCost);

        // DPM과 오버된 가동률 대미지를 교체
        const adjustedDPM = efficiency; // 환산된 대미지를 DPM으로 설정
        const overRateDamage = dpm; // 기존 DPM을 오버된 가동률 대미지로 설정

        // 환산된 대미지로 무기 추가
        setSelectedWeapons((prev) => [
          ...prev,
          {
            weaponId,
            weaponName: item.name,
            level,
            activationRate: remainingAvailability, // 남은 가동률만 사용
            efficiency: overRateDamage, // 오버된 가동률 대미지 저장
            dpm: adjustedDPM, // 환산된 대미지를 DPM으로 저장
          },
        ]);

        // 남은 가동률을 0으로 설정
        setRemainingAvailability(0);
      }
    }
  };

  const handleWeaponRemoval = (weaponId: string) => {
    const weaponIndex = selectedWeapons.findIndex((w) => w.weaponId === weaponId);

    if (weaponIndex !== -1) {
      const weaponToRemove = selectedWeapons[weaponIndex];

      // 가동률 복구
      setRemainingAvailability((prev) => prev + weaponToRemove.activationRate);

      // 무기 목록에서 제거
      const updatedWeapons = [...selectedWeapons];
      updatedWeapons.splice(weaponIndex, 1);
      setSelectedWeapons(updatedWeapons);
    }
  };
  // console.log('정렬된 무기 리스트:', weaponScores);

  /**
   * 정렬 - 마나 대비 딜 순으로 정렬
   * 1. 플레이어 가동률 = (마나통 / 50) * 60 + (마나통 + 10)
   * 2. 무기 강화별 가동률 = 60 / 쿨타임 * 마나
   * 3. 플레이어 가동률 - 무기 강화별 가동률
   * 4. 계속 빼다가 3번이 음수가 될 때
   *    남은 가동률 * 마나 대비 딜 (표기딜 / 마나)
   */

  // 운명 무기 리스트
  // console.log('운명 무기 리스트', destinyAwakenings);

  // 운명 무기 DPM 계산
  const destinyWeaponDPM = useMemo(() => {
    return destinyItems.reduce((total, job) => {
      const selectedLevel = destinyAwakenings[job.id] ?? 0; // 선택된 각성 차수
      if (selectedLevel > 0) {
        const leftCoolTime = job.damages?.[0]?.left_cooldown?.[selectedLevel - 1] ?? 1;
        const rightCoolTime = job.damages?.[0]?.right_cooldown ?? 1;

        const leftDamage =
          (60 / leftCoolTime) *
          ((job.damages?.[0]?.left?.[selectedLevel - 1] ?? 0) * (job.damages?.[0]?.left_times ?? 1));
        const rightDamage =
          (60 / rightCoolTime) * ((job.damages?.[0]?.right ?? 0) * (job.damages?.[0]?.right_times ?? 1));

        return total + leftDamage + rightDamage;
      }
      return total;
    }, 0);
  }, [destinyAwakenings]);
  // 길드 유대감 레벨
  const guildDamage = Number(guildAdditionalDamage) * GUILD_BASE_MULTIPLIER + Number(guildAdditionalDamage) * GUILD_STAT_MULTIPLIER;

  // 스텟
  const statDamage = Number(damageStat) * STAT_DAMAGE_MULTIPLIER;

  // 디바인 샤드
  const divineDamage = Number(divineShardDamage);

  // 대미지 환산
  // (직업 좌클릭 대미지 DPM+직업 우클릭 대미지 DPM+직업 쉬프트 우클릭DPM+운명 무기(좌클릭, 우클릭) DPM+열쇠무기환산)x(스텟+길드 유대감+디바인 샤드)x1.25

  // 최종 DPM 계산
  const finalDPM = useMemo(() => {
    const jobWeaponDPMValues = Object.values(jobWeaponDPMs).reduce((sum, dpm) => sum + dpm, 0);
    const specialWeaponDPM = selectedWeapons.reduce((sum, weapon) => sum + weapon.dpm, 0);

    const totalDPM = jobWeaponDPMValues + destinyWeaponDPM + specialWeaponDPM;
    const multiplier = (statDamage + guildDamage + divineDamage) / 100 + 1;

    return totalDPM * multiplier * FINAL_DPM_MULTIPLIER;
  }, [jobWeaponDPMs, destinyWeaponDPM, selectedWeapons, statDamage, guildDamage, divineDamage]);

  return (
    <div className='min-h-screen bg-slate-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200 mb-6 group'
        >
          <span className='transform group-hover:-translate-x-1 transition-transform duration-200'>←</span>
          <span className='font-medium'>메인으로 돌아가기</span>
        </Link>
      </div>
      <div className='container mx-auto max-w-7xl flex flex-col gap-10'>
        {/* 직업, 무기 강화 차수 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            직업 무기(5차)
          </h2>
          <div className='flex flex-wrap gap-4'>
            {jobItems?.map((job, index) => (
              <div
                key={`${index}_${job.id}`}
                className='group flex flex-col items-center rounded-xl bg-slate-900 border border-slate-700 p-4 w-[150px] hover:-translate-y-1 transition-all duration-200'
              >
                <span className='text-slate-300 font-semibold mb-2'>{job.id}</span>
                <select
                  value={jobWeaponLevels[job.id] ?? 0}
                  onChange={(e) => setJobWeaponLevels((prev) => ({ ...prev, [job.id]: Number(e.target.value) }))}
                  className='bg-slate-800 border border-slate-700 text-white text-sm px-3 py-2 rounded-lg w-full hover:border-slate-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:border-blue-500'
                >
                  {Array.from({ length: jobItems[0]?.damages?.[0]?.left?.length ?? 0 }).map((_, level) => (
                    <option key={level} value={level}>
                      Lv.{level + 1}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* 마나통 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            마나통
          </h2>
          <input
            type='text'
            placeholder='마나통 입력'
            value={manaPool}
            onChange={(e) => setManaPool(e.target.value)}
            className='w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200'
          />
        </div>

        {/* 추가된 무기 목록 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            추가된 무기 목록
          </h2>
          <div className='overflow-x-auto'>
            <div className='grid grid-cols-7 gap-4 p-4 bg-slate-900 rounded-xl text-slate-300 font-semibold border border-slate-700 mb-2'>
              <div>무기 이름</div>
              <div>레벨</div>
              <div>가동률</div>
              <div>DPM</div>
              <div>오버된 가동률 대미지</div>
              <div>삭제</div>
            </div>
            <div className='space-y-2'>
              {selectedWeapons
                .sort((a, b) => b.activationRate - a.activationRate)
                .map((weapon, index) => (
                  <div
                    key={`${index}_${weapon.weaponId}`}
                    className='grid grid-cols-7 gap-4 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200 text-sm'
                  >
                    <div className='text-white font-medium'>{weapon.weaponName}</div>
                    <div className='text-slate-300'>Lv.{weapon.level}</div>
                    <div className='text-blue-400'>{weapon.activationRate.toFixed(2)}</div>
                    <div className='text-white'>{weapon.dpm.toFixed(2)}</div>
                    <div className='text-yellow-400'>{weapon.efficiency ? weapon.efficiency.toFixed(2) : '-'}</div>
                    <button
                      onClick={() => handleWeaponRemoval(weapon.weaponId)}
                      className='bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-1'
                    >
                      삭제
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 특수 무기 (열쇠, 보스, 필멸) */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-4 text-white'>
            특수 무기(열쇠 무기, 필멸 무기, 보스 무기)
          </h2>
          <div className='mb-6 p-4 bg-slate-900 rounded-xl border border-slate-700'>
            <span className='text-lg text-slate-300'>현재 가동률: </span>
            <span className='text-2xl font-bold text-white'>
              {remainingAvailability.toFixed(2)}
            </span>
          </div>
          <div className='space-y-8'>
            {specialWeaponGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className='mb-4 text-xl font-semibold text-slate-300'>{group.title}</h3>
                <div className='gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                  {group.items?.map((item, index) => (
                    <div
                      key={`${index}_${item.id}`}
                      className='group flex flex-col items-center rounded-xl bg-slate-900 border border-slate-700 p-4 hover:-translate-y-1 transition-all duration-200'
                    >
                      <span className='text-center text-sm font-medium text-white mb-3'>{item.name}</span>
                      {/* 레벨 입력 */}
                      <input
                        type='number'
                        min='0'
                        max={item.damages!.length - 1}
                        value={specialWeaponLevels[item.id] ?? ''}
                        onChange={(e) => {
                          const level = Number(e.target.value);
                          if (level >= 0 && level < item.damages!.length) {
                            setSpecialWeaponLevels((prev) => ({ ...prev, [item.id]: level }));
                          }
                        }}
                        placeholder='레벨'
                        className='w-full text-sm px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200 mb-3'
                      />

                      {/* 추가 버튼 */}
                      <button
                        onClick={() => {
                          const level = specialWeaponLevels[item.id];
                          if (level !== undefined) {
                            handleWeaponSelection(item.id, level);
                          } else {
                            alert('레벨을 입력하세요.');
                          }
                        }}
                        className='w-full bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-1'
                      >
                        추가
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 운명 무기 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            운명 무기
          </h2>
          <div className='flex flex-wrap gap-4'>
            {destinyItems?.map((job, index) => {
              const selectedLevel = destinyAwakenings[job.id] ?? 0; // 선택된 각성 차수

              return (
                <div
                  key={`${index}_${job.id}`}
                  className='group flex flex-col items-center rounded-xl bg-slate-900 border border-slate-700 p-4 w-[150px] hover:-translate-y-1 transition-all duration-200'
                >
                  {/* 운명 무기 이름 */}
                  <span className='text-white font-bold mb-3'>{job.name}</span>

                  {/* 각성 단계 선택 */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      const level = Number(e.target.value);
                      setDestinyAwakenings((prev) => ({ ...prev, [job.id]: level }));
                    }}
                    className='w-full bg-slate-800 border border-slate-700 text-white text-sm px-3 py-2 rounded-lg hover:border-slate-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:border-blue-500'
                  >
                    <option value={0}>각성 없음</option>
                    {Array.from({ length: job.damages?.[0]?.left_cooldown?.length ?? 0 }).map((_, level) => (
                      <option key={level + 1} value={level + 1}>
                        각성+{level + 1}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* 보스 추가 대미지 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            보스 추가 대미지
          </h2>
          <input
            type='text'
            placeholder='보스 추가 대미지'
            value={bossAdditionalDamage}
            onChange={(e) => setBossAdditionalDamage(e.target.value)}
            className='w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200'
          />
        </div>

        {/* 길드 유대감 레벨 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            길드 유대감 레벨
          </h2>
          <input
            type='text'
            placeholder='길드 유대감 레벨'
            value={guildAdditionalDamage}
            onChange={(e) => setGuildAdditionalDamage(e.target.value)}
            className='w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200'
          />
        </div>

        {/* 스텟 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            스텟
          </h2>
          <input
            type='text'
            placeholder='대미지 스텟 입력'
            value={damageStat}
            onChange={(e) => setDamageStat(e.target.value)}
            className='w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200'
          />
        </div>

        {/* 디바인 샤드 */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl'>
          <h2 className='text-3xl font-bold mb-6 text-white'>
            디바인 샤드
          </h2>
          <input
            type='text'
            placeholder='대미지 스텟 입력'
            value={divineShardDamage}
            onChange={(e) => setDivineShardDamage(e.target.value)}
            className='w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-200'
          />
        </div>

        {/* 최종 DPM */}
        <div className='rounded-2xl bg-slate-800 border border-slate-700 p-12 shadow-xl text-center'>
          <h2 className='text-4xl font-bold mb-8 text-white'>
            최종 DPM
          </h2>
          <div className='text-6xl font-extrabold text-white'>
            {finalDPM.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
