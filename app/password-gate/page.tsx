'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordGatePage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (password === process.env.NEXT_PUBLIC_HWANSAN_PASSWORD) {
      localStorage.setItem('access_granted', 'true');
      router.push('/hwansan'); // 비밀 페이지로 이동
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
