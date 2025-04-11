'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function RegisterNickname({
  attempts,
  onSubmit,
  isOpen,
}: {
  attempts: number;
  onSubmit: (nickname: string) => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [nickname, setNickname] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const params = useParams();
  const itemId = params?.itemId as string;

  useEffect(() => {
    if (!nickname.trim()) {
      setIsDuplicate(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const leaderboardRaw = localStorage.getItem('leaderboard');
    const leaderboard = leaderboardRaw ? JSON.parse(leaderboardRaw) : {};
    const todayData = leaderboard[today];
    const todayEntries = Array.isArray(todayData?.[itemId]) ? todayData[itemId] : [];

    const duplicate = todayEntries.some((entry: { nickname: string }) => entry.nickname === nickname);
    setIsDuplicate(duplicate);
  }, [nickname, itemId]);

  const handleSubmit = () => {
    if (!nickname || isDuplicate) return;
    onSubmit(nickname);
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black'>
      <div className='bg-white p-6 rounded-xl max-w-sm w-full text-center'>
        <h2 className='text-xl font-bold mb-4'>축하합니다! 🎉</h2>
        <p className='mb-2'>
          총 강화 시도: <strong>{attempts}</strong>번
        </p>
        <input
          type='text'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder='닉네임을 입력하세요'
          className='border rounded px-4 py-2 w-full mb-2'
        />
        {isDuplicate && <p className='text-red-500 text-sm mb-2'>이미 등록된 닉네임입니다.</p>}
        <button
          onClick={handleSubmit}
          disabled={!nickname || isDuplicate}
          className={`px-4 py-2 rounded w-full text-white ${
            !nickname || isDuplicate ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
