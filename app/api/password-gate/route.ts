// app/api/password-gate/route.ts
import { supabase } from '@/lib/supabase/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();

  const { data, error } = await supabase.from('password').select('password').eq('id', 1).single();

  if (error || !data || data.password !== password) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('access_granted', 'true', {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
