// app/api/update-password/route.ts
import { updateRandomPassword } from '@/lib/supabase/updatePassword';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await updateRandomPassword();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
