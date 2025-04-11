const STORAGE_KEY = 'reinforce_leaderboard';
const RESET_KEY = 'reinforce_reset_at';

function getTodayDateString() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

export function getLeaderboard(): { nickname: string; attempts: number; date: string; itemName: string }[] {
  const resetAt = localStorage.getItem(RESET_KEY);
  const now = getTodayDateString();

  if (resetAt !== now) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(RESET_KEY, now);
    return [];
  }

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveToLeaderboard(nickname: string, attempts: number, itemName: string) {
  const current = getLeaderboard();
  current.push({ nickname, attempts, date: new Date().toISOString(), itemName });

  // 가장 적은 시도 순 정렬
  current.sort((a, b) => a.attempts - b.attempts);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 10))); // 상위 10명만 저장
}
