import { Loader2, Volume2 } from 'lucide-react';
import type { QuestionItem } from '../data/questions';

interface QuestionCardProps {
  item: QuestionItem;
  type: 'wh' | 'yesno';
  speak: (text: string, itemId: string) => void;
  activeSpeakingId: string | null;
}

const TYPE_STYLES = {
  wh: {
    card: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-950 hover:border-orange-400',
    word: 'text-orange-600 dark:text-orange-400',
    audio: 'bg-orange-100 dark:bg-orange-950 text-orange-600 hover:scale-110',
    arrow: 'text-orange-500'
  },
  yesno: {
    card: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-950 hover:border-amber-400',
    word: 'text-amber-600 dark:text-amber-400',
    audio: 'bg-amber-100 dark:bg-amber-950 text-amber-600 hover:scale-110',
    arrow: 'text-amber-500'
  }
};

export default function QuestionCard({ item, type, speak, activeSpeakingId }: QuestionCardProps) {
  const styles = TYPE_STYLES[type];
  const intonation = type === 'wh' ? '↘' : '↗';
  const intonationLabel = type === 'wh' ? 'entonación baja' : 'entonación sube';

  return (
    <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${styles.card}`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{item.icon}</span>
            <span className={`font-black text-lg ${styles.word}`}>
              {item.word}
            </span>
          </div>
          <button
            onClick={() => speak(`${item.word}. ${item.example} ${item.answer}`, item.id)}
            disabled={activeSpeakingId === item.id}
            className={`p-1.5 rounded-full transition-transform disabled:opacity-50 ${styles.audio}`}
            title="Escuchar ejemplo y respuesta"
          >
            {activeSpeakingId === item.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Meaning: <span className="text-slate-900 dark:text-slate-100 font-extrabold">{item.meaning}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start justify-between gap-2">
          <span>"{item.example}"</span>
          <span className={`not-italic font-black shrink-0 ${styles.arrow}`} title={intonationLabel}>
            {intonation}
          </span>
        </p>
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
          ✅ {item.answer}
        </p>
        {item.error && (
          <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-lg border border-red-200 dark:border-red-900">
            ❌ {item.error}
          </p>
        )}
        <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900 font-semibold">
          💡 {item.tip}
        </p>
      </div>
    </div>
  );
}
