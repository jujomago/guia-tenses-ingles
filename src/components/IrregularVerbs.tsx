import { useMemo, useState } from 'react';
import { Search, Loader2, Volume2 } from 'lucide-react';

interface IrregularVerb {
  base: string;
  past: string;
  participle: string;
  meaning: string;
}

export const IRREGULAR_VERBS: IrregularVerb[] = [
  // A-E
  { base: 'Be (am/is/are)', past: 'was / were', participle: 'been', meaning: 'Ser o Estar' },
  { base: 'Beat', past: 'beat', participle: 'beaten', meaning: 'Golpear / Vencer' },
  { base: 'Become', past: 'became', participle: 'become', meaning: 'Llegar a ser / Volverse' },
  { base: 'Begin', past: 'began', participle: 'begun', meaning: 'Empezar / Comenzar' },
  { base: 'Bend', past: 'bent', participle: 'bent', meaning: 'Doblar' },
  { base: 'Bet', past: 'bet', participle: 'bet', meaning: 'Apostar' },
  { base: 'Bite', past: 'bit', participle: 'bitten', meaning: 'Morder' },
  { base: 'Blow', past: 'blew', participle: 'blown', meaning: 'Soplar' },
  { base: 'Break', past: 'broke', participle: 'broken', meaning: 'Romper' },
  { base: 'Bring', past: 'brought', participle: 'brought', meaning: 'Traer' },
  { base: 'Build', past: 'built', participle: 'built', meaning: 'Construir' },
  { base: 'Burn', past: 'burned / burnt', participle: 'burned / burnt', meaning: 'Quemar' },
  { base: 'Buy', past: 'bought', participle: 'bought', meaning: 'Comprar' },
  { base: 'Catch', past: 'caught', participle: 'caught', meaning: 'Atrapar / Agarrar' },
  { base: 'Choose', past: 'chose', participle: 'chosen', meaning: 'Elegir / Escoger' },
  { base: 'Come', past: 'came', participle: 'come', meaning: 'Venir' },
  { base: 'Cost', past: 'cost', participle: 'cost', meaning: 'Costar' },
  { base: 'Cut', past: 'cut', participle: 'cut', meaning: 'Cortar' },
  { base: 'Do', past: 'did', participle: 'done', meaning: 'Hacer' },
  { base: 'Draw', past: 'drew', participle: 'drawn', meaning: 'Dibujar' },
  { base: 'Dream', past: 'dreamed / dreamt', participle: 'dreamed / dreamt', meaning: 'Soñar' },
  { base: 'Drink', past: 'drank', participle: 'drunk', meaning: 'Beber' },
  { base: 'Drive', past: 'drove', participle: 'driven', meaning: 'Manejar / Conducir' },
  { base: 'Dig', past: 'dug', participle: 'dug', meaning: 'Cavar' },
  { base: 'Eat', past: 'ate', participle: 'eaten', meaning: 'Comer' },
  // F-L
  { base: 'Fall', past: 'fell', participle: 'fallen', meaning: 'Caer' },
  { base: 'Feed', past: 'fed', participle: 'fed', meaning: 'Alimentar' },
  { base: 'Feel', past: 'felt', participle: 'felt', meaning: 'Sentir' },
  { base: 'Fight', past: 'fought', participle: 'fought', meaning: 'Luchar / Pelear' },
  { base: 'Find', past: 'found', participle: 'found', meaning: 'Encontrar' },
  { base: 'Flee', past: 'fled', participle: 'fled', meaning: 'Huir' },
  { base: 'Fly', past: 'flew', participle: 'flown', meaning: 'Volar' },
  { base: 'Forget', past: 'forgot', participle: 'forgotten', meaning: 'Olvidar' },
  { base: 'Forgive', past: 'forgave', participle: 'forgiven', meaning: 'Perdonar' },
  { base: 'Get', past: 'got', participle: 'got / gotten', meaning: 'Obtener / Conseguir' },
  { base: 'Give', past: 'gave', participle: 'given', meaning: 'Dar' },
  { base: 'Go', past: 'went', participle: 'gone', meaning: 'Ir' },
  { base: 'Grow', past: 'grew', participle: 'grown', meaning: 'Crecer / Cultivar' },
  { base: 'Hang', past: 'hung', participle: 'hung', meaning: 'Colgar' },
  { base: 'Have', past: 'had', participle: 'had', meaning: 'Tener / Haber' },
  { base: 'Hear', past: 'heard', participle: 'heard', meaning: 'Oír' },
  { base: 'Hide', past: 'hid', participle: 'hidden', meaning: 'Esconder' },
  { base: 'Hit', past: 'hit', participle: 'hit', meaning: 'Golpear / Pegar' },
  { base: 'Hold', past: 'held', participle: 'held', meaning: 'Sostener / Tener' },
  { base: 'Hurt', past: 'hurt', participle: 'hurt', meaning: 'Lastimar / Doler' },
  { base: 'Keep', past: 'kept', participle: 'kept', meaning: 'Mantener / Guardar' },
  { base: 'Know', past: 'knew', participle: 'known', meaning: 'Saber / Conocer' },
  { base: 'Lay', past: 'laid', participle: 'laid', meaning: 'Poner (algo)' },
  { base: 'Lead', past: 'led', participle: 'led', meaning: 'Liderar / Guiar' },
  { base: 'Learn', past: 'learned / learnt', participle: 'learned / learnt', meaning: 'Aprender' },
  { base: 'Leave', past: 'left', participle: 'left', meaning: 'Salir / Dejar' },
  { base: 'Lend', past: 'lent', participle: 'lent', meaning: 'Prestar' },
  { base: 'Let', past: 'let', participle: 'let', meaning: 'Permitir / Dejar' },
  { base: 'Lie', past: 'lay', participle: 'lain', meaning: 'Acostarse / Yacer' },
  { base: 'Lose', past: 'lost', participle: 'lost', meaning: 'Perder' },
  // M-R
  { base: 'Make', past: 'made', participle: 'made', meaning: 'Hacer / Fabricar' },
  { base: 'Mean', past: 'meant', participle: 'meant', meaning: 'Significar / Querer decir' },
  { base: 'Meet', past: 'met', participle: 'met', meaning: 'Conocer / Encontrarse' },
  { base: 'Pay', past: 'paid', participle: 'paid', meaning: 'Pagar' },
  { base: 'Put', past: 'put', participle: 'put', meaning: 'Poner' },
  { base: 'Read', past: 'read', participle: 'read', meaning: 'Leer' },
  { base: 'Ride', past: 'rode', participle: 'ridden', meaning: 'Montar (caballo / bici)' },
  { base: 'Ring', past: 'rang', participle: 'rung', meaning: 'Sonar / Tocar el timbre' },
  { base: 'Rise', past: 'rose', participle: 'risen', meaning: 'Levantarse / Subir' },
  { base: 'Run', past: 'ran', participle: 'run', meaning: 'Correr' },
  // S-Z
  { base: 'Say', past: 'said', participle: 'said', meaning: 'Decir' },
  { base: 'See', past: 'saw', participle: 'seen', meaning: 'Ver' },
  { base: 'Seek', past: 'sought', participle: 'sought', meaning: 'Buscar' },
  { base: 'Sell', past: 'sold', participle: 'sold', meaning: 'Vender' },
  { base: 'Send', past: 'sent', participle: 'sent', meaning: 'Enviar' },
  { base: 'Set', past: 'set', participle: 'set', meaning: 'Colocar / Establecer' },
  { base: 'Shake', past: 'shook', participle: 'shaken', meaning: 'Agitar / Sacudir' },
  { base: 'Shine', past: 'shone', participle: 'shone', meaning: 'Brillar / Relucir' },
  { base: 'Show', past: 'showed', participle: 'shown', meaning: 'Mostrar' },
  { base: 'Shut', past: 'shut', participle: 'shut', meaning: 'Cerrar' },
  { base: 'Sing', past: 'sang', participle: 'sung', meaning: 'Cantar' },
  { base: 'Sit', past: 'sat', participle: 'sat', meaning: 'Sentarse' },
  { base: 'Sleep', past: 'slept', participle: 'slept', meaning: 'Dormir' },
  { base: 'Speak', past: 'spoke', participle: 'spoken', meaning: 'Hablar' },
  { base: 'Spend', past: 'spent', participle: 'spent', meaning: 'Gastar / Pasar (tiempo)' },
  { base: 'Stand', past: 'stood', participle: 'stood', meaning: 'Pararse / Estar de pie' },
  { base: 'Steal', past: 'stole', participle: 'stolen', meaning: 'Robar' },
  { base: 'Strike', past: 'struck', participle: 'struck', meaning: 'Golpear / Huelga' },
  { base: 'Swear', past: 'swore', participle: 'sworn', meaning: 'Jurar' },
  { base: 'Sweep', past: 'swept', participle: 'swept', meaning: 'Barrer' },
  { base: 'Swim', past: 'swam', participle: 'swum', meaning: 'Nadar' },
  { base: 'Take', past: 'took', participle: 'taken', meaning: 'Tomar / Llevar' },
  { base: 'Teach', past: 'taught', participle: 'taught', meaning: 'Enseñar' },
  { base: 'Tell', past: 'told', participle: 'told', meaning: 'Contar / Decir' },
  { base: 'Think', past: 'thought', participle: 'thought', meaning: 'Pensar' },
  { base: 'Throw', past: 'threw', participle: 'thrown', meaning: 'Tirar / Lanzar' },
  { base: 'Understand', past: 'understood', participle: 'understood', meaning: 'Entender' },
  { base: 'Wake', past: 'woke', participle: 'woken', meaning: 'Despertar' },
  { base: 'Wear', past: 'wore', participle: 'worn', meaning: 'Usar / Llevar puesto' },
  { base: 'Weep', past: 'wept', participle: 'wept', meaning: 'Llorar' },
  { base: 'Win', past: 'won', participle: 'won', meaning: 'Ganar' },
  { base: 'Withdraw', past: 'withdrew', participle: 'withdrawn', meaning: 'Retirar' },
  { base: 'Write', past: 'wrote', participle: 'written', meaning: 'Escribir' }
];

interface IrregularVerbsProps {
  speakItemWithElevenLabs: (text: string, itemId: string) => void;
  activeSpeakingId: string | null;
}

export default function IrregularVerbs({ speakItemWithElevenLabs, activeSpeakingId }: IrregularVerbsProps) {
  const [verbSearch, setVerbSearch] = useState('');

  const filteredVerbs = useMemo(() => {
    if (!verbSearch) return IRREGULAR_VERBS;
    const q = verbSearch.toLowerCase();
    return IRREGULAR_VERBS.filter(v =>
      v.base.toLowerCase().includes(q) ||
      v.past.toLowerCase().includes(q) ||
      v.participle.toLowerCase().includes(q) ||
      v.meaning.toLowerCase().includes(q)
    );
  }, [verbSearch]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2">
            <span>📖</span> Verbos Irregulares
          </h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{filteredVerbs.length} verbos listados</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar verbo..."
            value={verbSearch}
            onChange={(e) => setVerbSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-44 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
        {filteredVerbs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm font-bold">
            🔍 No se encontraron verbos para "{verbSearch}"
          </div>
        ) : (
          filteredVerbs.map((v, i) => (
            <div key={v.base} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm">{v.base}</span>
                  <button
                    onClick={() => speakItemWithElevenLabs(`${v.base}, ${v.past}, ${v.participle}`, `verb-${i}`)}
                    disabled={activeSpeakingId === `verb-${i}`}
                    className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-colors disabled:opacity-50"
                  >
                    {activeSpeakingId === `verb-${i}` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold block">{v.meaning}</span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-extrabold block text-xs">Past: {v.past}</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono font-bold text-[11px] block">Participle: {v.participle}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
