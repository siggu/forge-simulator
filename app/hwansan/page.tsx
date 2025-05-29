import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HwansanClient from './hwansanClient';

export default async function HwansanPage() {
  const cookieStore = cookies();
  const accessGranted = (await cookieStore).get('access_granted');

  if (!accessGranted || accessGranted.value !== 'true') {
    redirect('/password-gate');
  }

  return <HwansanClient />;
}
