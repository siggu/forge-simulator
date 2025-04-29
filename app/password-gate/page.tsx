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
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-xl font-bold'>비밀번호를 입력하세요</h1>
      <input type='password' className='border p-2' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit} className='bg-blue-500 text-white px-4 py-2 rounded'>
        입장하기
      </button>
    </div>
  );
}
