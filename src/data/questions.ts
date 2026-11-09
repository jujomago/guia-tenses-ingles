export interface QuestionItem {
  id: string;
  word: string;
  meaning: string;
  icon: string;
  example: string;
  answer: string;
  error?: string;
  tip: string;
}

export const WH_WORDS: QuestionItem[] = [
  { id: 'what', word: 'WHAT', meaning: 'Qué / Cuál', icon: '❓', example: 'What is your favorite color?', answer: 'My favorite color is blue.', tip: 'Usado para cosas, acciones o ideas. Entonación ↘ descendente.' },
  { id: 'where', word: 'WHERE', meaning: 'Dónde', icon: '📍', example: 'Where do you live?', answer: 'I live in Cochabamba.', error: 'Where you live? → Where do you live?', tip: 'Usado para lugares. Siempre lleva auxiliar (do/does/did/is/are).' },
  { id: 'when', word: 'WHEN', meaning: 'Cuándo', icon: '🗓️', example: 'When is your birthday?', answer: "It's on May 3rd.", tip: 'Usado para tiempo, fechas y momentos.' },
  { id: 'why', word: 'WHY', meaning: 'Por qué', icon: '🤔', example: 'Why are you happy?', answer: 'Because I passed my exam.', tip: 'Pregunta la razón. Se responde con "Because...".', error: 'Because I am happy because... → Because... (una sola vez)' },
  { id: 'who', word: 'WHO', meaning: 'Quién', icon: '👤', example: 'Who is your teacher?', answer: 'Mr. Smith is my teacher.', tip: 'Usado para identificar personas (sujeto).' },
  { id: 'which', word: 'WHICH', meaning: 'Cuál (opción)', icon: '👉', example: 'Which pizza do you want?', answer: 'I want the pepperoni one.', tip: 'Usado cuando hay pocas opciones a elegir.' },
  { id: 'how', word: 'HOW', meaning: 'Cómo', icon: '⚙️', example: 'How are you today?', answer: "I'm great, thanks!", tip: 'Usado para estados, maneras o procedimientos.' },
  { id: 'whose', word: 'WHOSE', meaning: '¿De quién?', icon: '🔑', example: 'Whose jacket is this?', answer: "It's Ana's jacket.", tip: 'Pregunta de quién es una posesión u objeto.' },
  { id: 'how_many', word: 'HOW MANY', meaning: 'Cuántos(as)', icon: '🔢', example: 'How many apples do you have?', answer: 'I have five apples.', error: 'How much people? → How many people?', tip: 'Solo para cosas CONTABLES (manzanas, autos, personas).' },
  { id: 'how_much', word: 'HOW MUCH', meaning: 'Cuánto(a)', icon: '🥤', example: 'How much water do you drink?', answer: 'I drink two liters a day.', tip: 'Para cosas INCONTABLES (agua, dinero, tiempo) y precios.' },
  { id: 'what_time', word: 'WHAT TIME', meaning: '¿A qué hora?', icon: '⏰', example: 'What time do you go to school?', answer: 'I go to school at 7 a.m.', tip: 'Pregunta por horas exactas del reloj.' }
];

export const YES_NO_AUXS: QuestionItem[] = [
  { id: 'do_does', word: 'DO / DOES', meaning: 'Sí/No (Presente)', icon: '🔄', example: 'Does she eat pizza?', answer: "Yes, she does. / No, she doesn't.", error: 'She eat pizza? → Does she eat pizza?', tip: 'DO con I/you/we/they. DOES con he/she/it. Verbo SIEMPRE en base.' },
  { id: 'did', word: 'DID', meaning: 'Sí/No (Pasado)', icon: '⏪', example: 'Did he go to the party?', answer: "Yes, he did. / No, he didn't.", error: 'Did he went? → Did he go?', tip: 'Siempre DID + verbo en base (nunca en pasado).' },
  { id: 'be', word: 'IS / ARE / AM', meaning: 'Sí/No con To Be', icon: '🧍', example: 'Are you a student?', answer: "Yes, I am. / No, I'm not.", error: 'You are student? → Are you a student?', tip: 'AM con I · IS con he/she/it · ARE con you/we/they.' },
  { id: 'was_were', word: 'WAS / WERE', meaning: 'To Be en pasado', icon: '📜', example: 'Was he at home?', answer: "Yes, he was. / No, he wasn't.", tip: 'WAS con I/he/she/it · WERE con you/we/they.' },
  { id: 'have_has', word: 'HAVE / HAS', meaning: 'Perfecto (Presente)', icon: '🎁', example: 'Have you eaten lunch yet?', answer: "Yes, I have. / No, I haven't.", error: 'You have eaten? → Have you eaten?', tip: 'HAVE con I/you/we/they · HAS con he/she/it + participio.' },
  { id: 'can_could', word: 'CAN / COULD', meaning: 'Habilidad / Permiso', icon: '💪', example: 'Can you swim?', answer: "Yes, I can. / No, I can't.", tip: 'COULD es la forma pasada y también suena más cortés.' },
  { id: 'will', word: 'WILL', meaning: 'Futuro', icon: '🔮', example: 'Will you come tomorrow?', answer: "Yes, I will. / No, I won't.", tip: 'WILL + verbo base. Negativo corto: won\'t (will not).' },
  { id: 'should_would', word: 'SHOULD / WOULD', meaning: 'Consejo / Cortesía', icon: '🤝', example: 'Should I wait here?', answer: "Yes, you should. / No, you shouldn't.", tip: 'SHOULD = consejo. WOULD = pedidos más corteses (Would you...?).' }
];
