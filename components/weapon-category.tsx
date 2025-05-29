import Link from 'next/link';

interface WeaponCategoryProps {
  title: string;
  color: 'blue' | 'purple' | 'yellow' | 'red';
  href: string;
  onClick?: () => void;
}

const colorMap = {
  blue: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-700',
  purple: 'bg-purple-600 hover:bg-purple-500 text-white border-purple-700',
  yellow: 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-600',
  red: 'bg-red-600 hover:bg-red-500 text-white border-red-700',
};

export function WeaponCategory({ title, color, href, onClick }: WeaponCategoryProps) {
  return (
    <div onClick={onClick}>
      <Link
        href={href}
        className={`${colorMap[color]} p-8 rounded-xl border-2 shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
      >
        <h2 className='text-3xl font-bold text-center tracking-tight'>{title}</h2>
      </Link>
    </div>
  );
}
