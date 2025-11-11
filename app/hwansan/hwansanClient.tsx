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
    <div className='min-h-screen bg-zinc-900 text-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Link href='/' className='text-blue-400 hover:underline mb-4 inline-block'>
          ← 메인으로 돌아가기
        </Link>
      </div>
      <div className='container mx-auto max-w-7xl flex flex-col gap-10'>
        {/* 직업, 무기 강화 차수 */}
        <div className='text-2xl'>직업 무기(5차)</div>
        <div className='flex gap-4'>
          {jobItems?.map((job, index) => (
            <div
              key={`${index}_${job.id}`}
              className='group flex flex-col items-center rounded bg-zinc-800 p-2 w-[150px]'
            >
              <select
                value={jobWeaponLevels[job.id] ?? 0}
                onChange={(e) => setJobWeaponLevels((prev) => ({ ...prev, [job.id]: Number(e.target.value) }))}
                className='mt-2 bg-zinc-700 text-white text-sm px-2 py-1 rounded w-full flex justify-end'
              >
                {Array.from({ length: jobItems[0]?.damages?.[0]?.left?.length ?? 0 }).map((_, level) => (
                  <option key={level} value={level}>
                    Lv.{level + 1}
                  </option>
                ))}
              </select>
              <span>{job.id}</span>
            </div>
          ))}
        </div>

        {/* 마나통 */}
        <div>
          <div className='text-2xl'>마나통</div>
          <input
            type='text'
            placeholder='마나통 입력'
            value={manaPool}
            onChange={(e) => setManaPool(e.target.value)}
            className='p-2 border border-2-white rounded w-100'
          />
        </div>

        {/* 추가된 무기 목록 */}
        <div className='mt-6'>
          <h2 className='text-xl font-bold mb-2'>🔑 추가된 무기 목록</h2>
          <div className='grid grid-cols-7 gap-4 p-2 bg-zinc-800 text-white font-semibold border-b border-zinc-500'>
            <div>무기 이름</div>
            <div>레벨</div>
            <div>가동률</div>
            <div>DPM</div>
            <div>오버된 가동률 대미지</div>
            <div>삭제</div>
          </div>
          {selectedWeapons
            .sort((a, b) => b.activationRate - a.activationRate) // 가동률 높은 순으로 정렬
            .map((weapon, index) => (
              <div
                key={`${index}_${weapon.weaponId}`}
                className='grid grid-cols-7 gap-4 p-2 border-b border-zinc-700 text-sm'
              >
                <div>{weapon.weaponName}</div>
                <div>Lv.{weapon.level}</div>
                <div>{weapon.activationRate.toFixed(2)}</div>
                <div>{weapon.dpm.toFixed(2)}</div>
                <div>{weapon.efficiency ? weapon.efficiency.toFixed(2) : '-'}</div>
                <button
                  onClick={() => handleWeaponRemoval(weapon.weaponId)}
                  className='bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded'
                >
                  삭제
                </button>
              </div>
            ))}
        </div>

        {/* 특수 무기 (열쇠, 보스, 필멸) */}
        <div className='text-2xl'>특수 무기(열쇠 무기, 필멸 무기, 보스 무기)</div>
        <div className='text-lg mt-2 mb-4'>
          현재 가동률: <span className='font-bold'>{remainingAvailability.toFixed(2)}</span>
        </div>
        {specialWeaponGroups.map((group, idx) => (
          <div key={idx}>
            <div className='mb-2 text-lg font-semibold'>{group.title}</div>
            <div className='gap-4 grid grid-cols-3 md:grid-cols-6'>
              {group.items?.map((item, index) => (
                <div
                  key={`${index}_${item.id}`}
                  className='group flex flex-col items-center rounded bg-zinc-800 p-2 w-[150px]'
                >
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
                    placeholder='레벨 입력'
                    className='mt-2 text-sm px-2 py-1 rounded w-full bg-zinc-700 text-white text-center'
                  />
                  <span className='mt-2'>{item.name}</span>

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
                    className='mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded'
                  >
                    추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 운명 무기 */}
        <div className='text-2xl'>운명 무기</div>
        <div className='flex flex-wrap gap-4'>
          {destinyItems?.map((job, index) => {
            const selectedLevel = destinyAwakenings[job.id] ?? 0; // 선택된 각성 차수

            return (
              <div
                key={`${index}_${job.id}`}
                className='group flex flex-col items-center rounded bg-zinc-800 p-4 w-[150px]'
              >
                {/* 운명 무기 이름 */}
                <span className='text-white font-bold'>{job.name}</span>

                {/* 각성 단계 선택 */}
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    const level = Number(e.target.value);
                    setDestinyAwakenings((prev) => ({ ...prev, [job.id]: level }));
                  }}
                  className='mt-2 bg-zinc-700 text-white text-sm px-2 py-1 rounded w-full'
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

        {/* 보스 추가 대미지 */}
        <div>
          <div className='text-2xl'>보스 추가 대미지</div>
          <input
            type='text'
            placeholder='보스 추가 대미지'
            value={bossAdditionalDamage}
            onChange={(e) => setBossAdditionalDamage(e.target.value)}
            className='p-2 border border-2-white rounded w-100'
          />
        </div>

        {/* 길드 유대감 레벨 */}
        <div>
          <div className='text-2xl'>길드 유대감 레벨</div>
          <input
            type='text'
            placeholder='길드 유대감 레벨'
            value={guildAdditionalDamage}
            onChange={(e) => setGuildAdditionalDamage(e.target.value)}
            className='p-2 border border-2-white rounded w-100'
          />
        </div>

        {/* 스텟 */}
        <div>
          <div className='text-2xl'>스텟</div>
          <input
            type='text'
            placeholder='대미지 스텟 입력'
            value={damageStat}
            onChange={(e) => setDamageStat(e.target.value)}
            className='p-2 border border-2-white rounded w-100'
          />
        </div>

        {/* 디바인 샤드 */}
        <div>
          <div className='text-2xl'>디바인 샤드</div>
          <div className='flex gap-4'>
            <input
              type='text'
              placeholder='대미지 스텟 입력'
              value={divineShardDamage}
              onChange={(e) => setDivineShardDamage(e.target.value)}
              className='p-2 border border-2-white rounded w-100'
            />
          </div>
        </div>

        {/* 최종 DPM */}
        <div className='flex flex-col items-center'>
          <div className='text-2xl'>최종 DPM</div>
          <div className='text-3xl font-bold text-yellow-400'>{finalDPM.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
