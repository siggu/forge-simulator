'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabase';

type Props = {
  attempts: number;
  isOpen: boolean;
};

export default function RegisterNickname({ attempts, isOpen }: Props) {
  const [nickname, setNickname] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const itemId = typeof params?.itemId === 'string' ? params.itemId : undefined;

  // ✅ 닉네임 중복 확인 (Supabase 기반)
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!nickname.trim() || !itemId) {
        setIsDuplicate(false);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('leaderboard')
        .select('nickname')
        .eq('item_id', itemId)
        .gte('timestamp', `${today}T00:00:00.000Z`);

      if (error) {
        // Failed to check duplicate, skip validation
        return;
      }

      const exists = data?.some((entry) => entry.nickname === nickname);
      setIsDuplicate(exists);
    };

    checkDuplicate();
  }, [nickname, itemId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleModalClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!nickname || isDuplicate || isSubmitting || !itemId) return;

    setIsSubmitting(true);

    const kstNow = new Date(new Date().getTime() + 1000 * 60 * 60 * 9); // ✅ UTC → KST

    const { error } = await supabase.from('leaderboard').insert({
      item_id: itemId,
      nickname,
      attempts: attempts === 0 ? 1 : attempts,
      timestamp: kstNow,
    });

    setIsSubmitting(false);

    if (error) {
      alert('등록 실패. 잠시 후 다시 시도해주세요.');
      return;
    }

    window.location.reload();
  };

  const handleModalClose = () => {
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black'>
      <div className='bg-white p-6 rounded-xl max-w-sm w-full text-center'>
        <h2 className='text-xl font-bold mb-4'>축하합니다! 🎉</h2>
        <p className='mb-2'>
          총 강화 시도: <strong>{attempts === 0 ? 1 : attempts}</strong>번
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
          disabled={!nickname || isDuplicate || isSubmitting}
          className={`px-4 py-2 rounded w-full text-white mb-2 ${
            !nickname || isDuplicate || isSubmitting
              ? 'bg-zinc-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>

        <button
          onClick={handleModalClose}
          className='px-4 py-2 rounded w-full text-zinc-700 bg-zinc-200 hover:bg-zinc-300'
        >
          닫기(esc)
        </button>
      </div>
    </div>
  );
}
