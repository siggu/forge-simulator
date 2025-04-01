interface WeaponCategoryProps {
  title: string;
  color: 'blue' | 'purple' | 'yellow';
}

const colorMap = {
  blue: 'bg-blue-900 hover:bg-blue-800 text-blue-300 border-blue-600',
  purple: 'bg-purple-900 hover:bg-purple-800 text-purple-300 border-purple-600',
  yellow: 'bg-yellow-900 hover:bg-yellow-800 text-yellow-300 border-yellow-600',
};

export function WeaponGacha({ title, color }: WeaponCategoryProps) {
  return (
    <div
      className={`${colorMap[color]} p-8 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
    >
      <h2 className='text-3xl font-bold text-center'>{title}</h2>
    </div>
  );
}
