export type Structure = 'do' | 'be' | 'subject' | 'modal' | 'have';

export interface QuestionItem {
  id: string;
  word: string;
  meaning: string;
  icon: string;
  example: string;
  answer: string;
  error?: string;
  tip: string;
  structure: Structure;
}

// Meta por forma estructural: icono, etiqueta, badge de tarjeta y color de fila en el banner
export const STRUCT_META: Record<Structure, { icon: string; label: string; badge: string; badgeCls: string; rowCls: string }> = {
  do: {
    icon: '🔤', label: 'Verbo normal', badge: 'do',
    badgeCls: 'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
    rowCls: 'border-l-sky-500'
  },
  be: {
    icon: '🧍', label: 'To Be', badge: 'to be',
    badgeCls: 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
    rowCls: 'border-l-violet-500'
  },
  subject: {
    icon: '🎯', label: 'Wh- es el sujeto', badge: 'sujeto',
    badgeCls: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
    rowCls: 'border-l-rose-500'
  },
  modal: {
    icon: '💪', label: 'Modal', badge: 'modal',
    badgeCls: 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
    rowCls: 'border-l-teal-500'
  },
  have: {
    icon: '🎁', label: 'Presente perfecto', badge: 'have',
    badgeCls: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800',
    rowCls: 'border-l-fuchsia-500'
  }
};

export interface FormulaPill {
  text: string;
  type: string;
}

export interface FormulaRow {
  structure: Structure;
  when: string;
  pills: FormulaPill[];
  example: string;
  note?: string;
}

// Wh-: el "motor" cambia según el verbo — por eso hay 4 formas, no una sola
export const WH_FORMULAS: FormulaRow[] = [
  {
    structure: 'do',
    when: 'el verbo es de acción (live, want, go...)',
    pills: [
      { text: '(Wh-)', type: 'wh' },
      { text: 'DO / DOES / DID', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Where do you live?',
    note: 'el verbo va SIEMPRE en base'
  },
  {
    structure: 'be',
    when: 'el verbo es IS / ARE / WAS / WERE (to be)',
    pills: [
      { text: '(Wh-)', type: 'wh' },
      { text: 'IS / ARE', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'When is your birthday?',
    note: 'nunca do/does con to be · sin verbo base'
  },
  {
    structure: 'subject',
    when: 'el Wh- ES el sujeto (Who, What...)',
    pills: [
      { text: 'Wh-', type: 'wh' },
      { text: 'Verb (Conjugado)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Who is your teacher?',
    note: 'sin auxiliar ni inversión'
  },
  {
    structure: 'modal',
    when: 'hay un modal (can, will, should...)',
    pills: [
      { text: '(Wh-)', type: 'wh' },
      { text: 'CAN / WILL / SHOULD', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'What can you see?',
    note: 'el verbo va en base'
  }
];

// Sí/No: el auxiliar manda — y tras To Be no hay verbo base, ni en perfecto (participio)
export const YESNO_FORMULAS: FormulaRow[] = [
  {
    structure: 'do',
    when: 'el verbo es de acción (live, eat, go...)',
    pills: [
      { text: 'DO / DOES / DID', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Does she eat pizza?',
    note: 'el verbo va SIEMPRE en base'
  },
  {
    structure: 'be',
    when: 'el verbo es IS / ARE / AM / WAS / WERE',
    pills: [
      { text: 'IS / ARE', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Are you a student?',
    note: 'sin verbo base tras el sujeto'
  },
  {
    structure: 'have',
    when: 'presente perfecto (have / has)',
    pills: [
      { text: 'HAVE / HAS', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Participio', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Have you eaten lunch yet?',
    note: 'participio (eaten), no verbo en base'
  },
  {
    structure: 'modal',
    when: 'permiso, futuro, consejo (can, will, should)',
    pills: [
      { text: 'CAN / WILL / SHOULD', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    example: 'Can you swim?',
    note: 'el verbo va en base'
  }
];

export const WH_WORDS: QuestionItem[] = [
  { id: 'what', word: 'WHAT', meaning: 'Qué / Cuál', icon: '❓', example: 'What is your favorite color?', answer: 'My favorite color is blue.', tip: 'Usado para cosas, acciones o ideas. Entonación ↘ descendente.', structure: 'be' },
  { id: 'where', word: 'WHERE', meaning: 'Dónde', icon: '📍', example: 'Where do you live?', answer: 'I live in Cochabamba.', error: 'Where you live? → Where do you live?', tip: 'Usado para lugares. Siempre lleva auxiliar (do/does/did/is/are).', structure: 'do' },
  { id: 'when', word: 'WHEN', meaning: 'Cuándo', icon: '🗓️', example: 'When is your birthday?', answer: "It's on May 3rd.", tip: 'Usado para tiempo, fechas y momentos.', structure: 'be' },
  { id: 'why', word: 'WHY', meaning: 'Por qué', icon: '🤔', example: 'Why are you happy?', answer: 'Because I passed my exam.', tip: 'Pregunta la razón. Se responde con "Because...".', error: 'Because I am happy because... → Because... (una sola vez)', structure: 'be' },
  { id: 'who', word: 'WHO', meaning: 'Quién', icon: '👤', example: 'Who is your teacher?', answer: 'Mr. Smith is my teacher.', tip: 'Usado para identificar personas (sujeto).', structure: 'subject' },
  { id: 'which', word: 'WHICH', meaning: 'Cuál (opción)', icon: '👉', example: 'Which pizza do you want?', answer: 'I want the pepperoni one.', tip: 'Usado cuando hay pocas opciones a elegir.', structure: 'do' },
  { id: 'how', word: 'HOW', meaning: 'Cómo', icon: '⚙️', example: 'How are you today?', answer: "I'm great, thanks!", tip: 'Usado para estados, maneras o procedimientos.', structure: 'be' },
  { id: 'whose', word: 'WHOSE', meaning: '¿De quién?', icon: '🔑', example: 'Whose jacket is this?', answer: "It's Ana's jacket.", tip: 'Pregunta de quién es una posesión u objeto.', structure: 'be' },
  { id: 'how_many', word: 'HOW MANY', meaning: 'Cuántos(as)', icon: '🔢', example: 'How many apples do you have?', answer: 'I have five apples.', error: 'How much people? → How many people?', tip: 'Solo para cosas CONTABLES (manzanas, autos, personas).', structure: 'do' },
  { id: 'how_much', word: 'HOW MUCH', meaning: 'Cuánto(a)', icon: '🥤', example: 'How much water do you drink?', answer: 'I drink two liters a day.', tip: 'Para cosas INCONTABLES (agua, dinero, tiempo) y precios.', structure: 'do' },
  { id: 'what_time', word: 'WHAT TIME', meaning: '¿A qué hora?', icon: '⏰', example: 'What time do you go to school?', answer: 'I go to school at 7 a.m.', tip: 'Pregunta por horas exactas del reloj.', structure: 'do' }
];

export const YES_NO_AUXS: QuestionItem[] = [
  { id: 'do_does', word: 'DO / DOES', meaning: 'Sí/No (Presente)', icon: '🔄', example: 'Does she eat pizza?', answer: "Yes, she does. / No, she doesn't.", error: 'She eat pizza? → Does she eat pizza?', tip: 'DO con I/you/we/they. DOES con he/she/it. Verbo SIEMPRE en base.', structure: 'do' },
  { id: 'did', word: 'DID', meaning: 'Sí/No (Pasado)', icon: '⏪', example: 'Did he go to the party?', answer: "Yes, he did. / No, he didn't.", error: 'Did he went? → Did he go?', tip: 'Siempre DID + verbo en base (nunca en pasado).', structure: 'do' },
  { id: 'be', word: 'IS / ARE / AM', meaning: 'Sí/No con To Be', icon: '🧍', example: 'Are you a student?', answer: "Yes, I am. / No, I'm not.", error: 'You are student? → Are you a student?', tip: 'AM con I · IS con he/she/it · ARE con you/we/they.', structure: 'be' },
  { id: 'was_were', word: 'WAS / WERE', meaning: 'To Be en pasado', icon: '📜', example: 'Was he at home?', answer: "Yes, he was. / No, he wasn't.", tip: 'WAS con I/he/she/it · WERE con you/we/they.', structure: 'be' },
  { id: 'have_has', word: 'HAVE / HAS', meaning: 'Perfecto (Presente)', icon: '🎁', example: 'Have you eaten lunch yet?', answer: "Yes, I have. / No, I haven't.", error: 'You have eaten? → Have you eaten?', tip: 'HAVE con I/you/we/they · HAS con he/she/it + participio.', structure: 'have' },
  { id: 'can_could', word: 'CAN / COULD', meaning: 'Habilidad / Permiso', icon: '💪', example: 'Can you swim?', answer: "Yes, I can. / No, I can't.", tip: 'COULD es la forma pasada y también suena más cortés.', structure: 'modal' },
  { id: 'will', word: 'WILL', meaning: 'Futuro', icon: '🔮', example: 'Will you come tomorrow?', answer: "Yes, I will. / No, I won't.", tip: "WILL + verbo base. Negativo corto: won't (will not).", structure: 'modal' },
  { id: 'should_would', word: 'SHOULD / WOULD', meaning: 'Consejo / Cortesía', icon: '🤝', example: 'Should I wait here?', answer: "Yes, you should. / No, you shouldn't.", tip: 'SHOULD = consejo. WOULD = pedidos más corteses (Would you...?).', structure: 'modal' }
];
