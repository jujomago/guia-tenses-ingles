export const COLOR_DICT = {
  subject: { label: 'Subject', bg: 'bg-indigo-100 dark:bg-indigo-950/80', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-300 dark:border-indigo-700' },
  verb: { label: 'Verb', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-700' },
  aux: { label: 'Auxiliary / To Be', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-700' },
  complement: { label: 'Complement', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-700' },
  wh: { label: 'Wh- Word', bg: 'bg-orange-100 dark:bg-orange-950/80', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-300 dark:border-orange-700' }
};

export const PillTag = ({ text, type, size = 'md' }: { text: string; type: string; size?: string }) => {
  const meta = COLOR_DICT[type as keyof typeof COLOR_DICT] || { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';

  return (
    <span className={`inline-flex items-center font-extrabold border-2 rounded-lg shadow-sm ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses}`}>
      {text}
    </span>
  );
};
