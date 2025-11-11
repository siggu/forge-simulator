'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordGatePage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  // const handleSubmit = async () => {
  //   if (password === process.env.NEXT_PUBLIC_HWANSAN_ENTER_PASSWORD) {
  //     document.cookie = 'access_granted=true; path=/; max-age=3600; samesite=strict';
  //     router.push('/hwansan');
  //   } else {
  //     alert('비밀번호가 틀렸습니다.');
  //   }
  // };

  const handleSubmit = async () => {
    const res = await fetch('/api/password-gate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/hwansan');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className='min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-8 p-4'>
      <div className='bg-slate-800 border border-slate-700 rounded-2xl p-12 shadow-xl max-w-md w-full'>
        <h1 className='text-3xl font-extrabold text-center mb-8 text-white'>
          환산 계산기 입장
        </h1>

        <div className='space-y-6'>
          <div>
            <label className='block text-slate-300 mb-2 text-sm font-medium'>비밀번호</label>
            <input
              type='password'
              className='w-full bg-slate-700 border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder='비밀번호를 입력하세요'
            />
          </div>

          <button
            onClick={handleSubmit}
            className='w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:-translate-y-1'
          >
            입장하기
          </button>
        </div>
      </div>
    </div>
  );
}
