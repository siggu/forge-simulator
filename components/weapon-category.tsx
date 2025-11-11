import Link from 'next/link';

interface WeaponCategoryProps {
  title: string;
  color: 'blue' | 'purple' | 'yellow' | 'red';
  href: string;
  onClick?: () => void;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    hover: 'group-hover:bg-blue-500/20',
    border: 'border-blue-500/30 group-hover:border-blue-400/60',
    glow: 'group-hover:shadow-blue-500/50',
    text: 'text-blue-300',
  },
  purple: {
    bg: 'bg-purple-500/10',
    hover: 'group-hover:bg-purple-500/20',
    border: 'border-purple-500/30 group-hover:border-purple-400/60',
    glow: 'group-hover:shadow-purple-500/50',
    text: 'text-purple-300',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    hover: 'group-hover:bg-yellow-500/20',
    border: 'border-yellow-500/30 group-hover:border-yellow-400/60',
    glow: 'group-hover:shadow-yellow-500/50',
    text: 'text-yellow-300',
  },
  red: {
    bg: 'bg-red-500/10',
    hover: 'group-hover:bg-red-500/20',
    border: 'border-red-500/30 group-hover:border-red-400/60',
    glow: 'group-hover:shadow-red-500/50',
    text: 'text-red-300',
  },
};

export function WeaponCategory({ title, color, href, onClick }: WeaponCategoryProps) {
  const colors = colorMap[color];

  return (
    <div onClick={onClick}>
      <Link
        href={href}
        className={`group block relative overflow-hidden rounded-2xl ${colors.bg} ${colors.hover} border ${colors.border} shadow-xl transform hover:-translate-y-2 transition-all duration-200 p-10`}
      >
        {/* Content */}
        <div className='relative z-10 text-center'>
          <h2 className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
            {title}
          </h2>
        </div>
      </Link>
    </div>
  );
}
