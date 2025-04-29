import { supabase } from '@/lib/supabase/supabase';

export async function submitToLeaderboard({
  itemId,
  nickname,
  attempts,
}: {
  itemId: string;
  nickname: string;
  attempts: number;
}) {
  const { error } = await supabase.from('leaderboard').insert({
    item_id: itemId,
    nickname,
    attempts,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error('등록 실패:', error);
    throw new Error('등록 실패');
  }
}
