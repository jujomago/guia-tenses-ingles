import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { PillTag } from './PillTag';
import QuestionCard from './QuestionCard';
import { WH_WORDS, YES_NO_AUXS, WH_FORMULAS, YESNO_FORMULAS, STRUCT_META } from '../data/questions';
import type { FormulaRow } from '../data/questions';

interface QuestionsExplorerProps {
  speakItemWithElevenLabs: (text: string, itemId: string) => void;
  activeSpeakingId: string | null;
}

type TabId = 'wh' | 'yesno';

const TABS: { id: TabId; label: string; count: number; icon: string }[] = [
  { id: 'wh', label: 'Palabras Wh-', count: WH_WORDS.length, icon: '❓' },
  { id: 'yesno', label: 'Preguntas Sí/No', count: YES_NO_AUXS.length, icon: '🙋' }
];

export default function QuestionsExplorer({ speakItemWithElevenLabs, activeSpeakingId }: QuestionsExplorerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('wh');

  const items = activeTab === 'wh' ? WH_WORDS : YES_NO_AUXS;
  const isWh = activeTab === 'wh';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Questions Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No todas las preguntas empiezan con Wh-: las Sí/No empiezan con un <strong>AUXILIAR</strong>. Haz clic en 🎙️ para escuchar.
          </p>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${isWh ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'}`}>
          {items.length} {isWh ? 'palabras' : 'auxiliares'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-2xl">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Formula banner — fórmulas apiladas: el motor cambia según el verbo/auxiliar */}
      <div className={`p-4 rounded-2xl border-2 space-y-2 ${isWh ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-900' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900'}`}>
        <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Fórmulas de la pregunta {isWh ? 'Wh-' : 'Sí/No'} — el motor cambia según {isWh ? 'el verbo' : 'el auxiliar'}:
        </span>
        {(isWh ? WH_FORMULAS : YESNO_FORMULAS).map((row: FormulaRow) => {
          const meta = STRUCT_META[row.structure];
          return (
            <div key={row.structure} className={`bg-white dark:bg-slate-800 rounded-xl p-2.5 space-y-1.5 border-l-4 ${meta.rowCls}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {meta.icon} {meta.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  — cuando {row.when}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {row.pills.map((pill, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    {i > 0 && <span className="text-slate-400 font-extrabold text-xs">+</span>}
                    <PillTag text={pill.text} type={pill.type} size="sm" />
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-bold">Ej: </span>
                <span className="italic">"{row.example}"</span>
                {row.note && (
                  <span className="ml-2 font-semibold text-slate-500 dark:text-slate-400">
                    ⚠ {row.note}
                  </span>
                )}
              </p>
            </div>
          );
        })}
        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
          {isWh ? (
            <>🔚 Entonación <span className="text-orange-500 text-sm font-black">↘</span> descendente — respuesta: información (lugar, tiempo, razón...)</>
          ) : (
            <>🔚 Entonación <span className="text-amber-500 text-sm font-black">↗</span> ascendente — respuesta: <strong>Yes / No</strong> (+ auxiliar)</>
          )}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(item => (
          <QuestionCard
            key={item.id}
            item={item}
            type={isWh ? 'wh' : 'yesno'}
            speak={speakItemWithElevenLabs}
            activeSpeakingId={activeSpeakingId}
          />
        ))}
      </div>
    </div>
  );
}
