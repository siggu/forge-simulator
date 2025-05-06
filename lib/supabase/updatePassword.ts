// lib/updatePassword.ts
import { supabase } from './supabase';

export async function updateRandomPassword() {
  const randomPassword = Math.random().toString(36).slice(-10); // 예: 10자리 영문+숫자

  const { data, error } = await supabase.from('password').update({ password: randomPassword }).eq('id', 1);

  if (error) {
    throw new Error(`비밀번호 업데이트 실패: ${error.message}`);
  }

  return data;
}
