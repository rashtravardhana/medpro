import type { Profile } from '@/types';

interface Props {
  profile: Profile;
}

export default function ProfileProgress({ profile }: Props) {
  const fields = [
    { label: 'Name', done: !!profile.name },
    { label: 'Profession', done: !!profile.profession },
    { label: 'Resume uploaded', done: !!profile.resume_url },
    { label: 'Avatar uploaded', done: !!profile.avatar_url },
  ];

  const completed = fields.filter((f) => f.done).length;
  const percentage = Math.round((completed / fields.length) * 100);

  const color =
    percentage === 100
      ? 'bg-green-500'
      : percentage >= 50
      ? 'bg-blue-500'
      : 'bg-orange-400';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Profile Completeness</h3>
        <span className="text-sm font-bold text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <ul className="space-y-1.5">
        {fields.map((f) => (
          <li key={f.label} className="flex items-center gap-2 text-sm">
            {f.done ? (
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            )}
            <span className={f.done ? 'text-gray-700' : 'text-gray-400'}>{f.label}</span>
          </li>
        ))}
      </ul>
      {percentage < 100 && (
        <a href="/profile" className="mt-4 block text-center text-sm text-blue-600 hover:underline font-medium">
          Complete your profile →
        </a>
      )}
    </div>
  );
}
