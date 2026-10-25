import React, { useState, useMemo } from 'react';
import { 
  Trophy, Star, Flame, Sparkles, BookOpen, Brain, RefreshCw, 
  CheckCircle2, XCircle, Volume2, VolumeX, Search, ArrowRight,
  Sliders, Loader2
} from 'lucide-react';

// --- DATA STRUCTURES ---

// ElevenLabs Configuration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string;

const COLOR_DICT = {
  subject: { label: 'Subject', bg: 'bg-indigo-100 dark:bg-indigo-950/80', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-300 dark:border-indigo-700' },
  verb: { label: 'Verb', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-700' },
  aux: { label: 'Auxiliary / To Be', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-700' },
  complement: { label: 'Complement', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-700' },
  wh: { label: 'Wh- Word', bg: 'bg-orange-100 dark:bg-orange-950/80', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-300 dark:border-orange-700' }
};

const WH_WORDS = [
  { id: 'what', word: 'WHAT', meaning: 'Qué / Cuál', icon: '❓', example: 'What is your favorite color?', tip: 'Usado para cosas, acciones o ideas.' },
  { id: 'where', word: 'WHERE', meaning: 'Dónde', icon: '📍', example: 'Where do you live?', tip: 'Usado para lugares y ubicaciones.' },
  { id: 'when', word: 'WHEN', meaning: 'Cuándo', icon: '🗓️', example: 'When is your birthday?', tip: 'Usado para tiempo, fechas y momentos.' },
  { id: 'why', word: 'WHY', meaning: 'Por qué', icon: '🤔', example: 'Why are you happy?', tip: 'Pregunta la razón. Se responde con "Because...".' },
  { id: 'who', word: 'WHO', meaning: 'Quién', icon: '👤', example: 'Who is your teacher?', tip: 'Usado para identificar personas.' },
  { id: 'which', word: 'WHICH', meaning: 'Cuál (opción)', icon: '👉', example: 'Which pizza do you want?', tip: 'Usado cuando hay pocas opciones a elegir.' },
  { id: 'how', word: 'HOW', meaning: 'Cómo', icon: '⚙️', example: 'How are you today?', tip: 'Usado para estados, maneras o procedimientos.' },
  { id: 'whose', word: 'WHOSE', meaning: '¿De quién?', icon: '🔑', example: 'Whose jacket is this?', tip: 'Pregunta de quién es una posesión u objeto.' },
  { id: 'how_many', word: 'HOW MANY', meaning: 'Cuántos(as)', icon: '🔢', example: 'How many apples do you have?', tip: 'Usado para cosas contables (manzanas, autos).' },
  { id: 'how_much', word: 'HOW MUCH', meaning: 'Cuánto(a)', icon: '🥤', example: 'How much water do you drink?', tip: 'Usado para cosas incontables (agua, dinero).' },
  { id: 'what_time', word: 'WHAT TIME', meaning: '¿A qué hora?', icon: '⏰', example: 'What time do you go to school?', tip: 'Pregunta por horas exactas del reloj.' }
];

const TENSES_DATA = [
  {
    id: 'present_simple',
    title: '1. Present Simple',
    subjects: ['I', 'He', 'They'],
    dynamicVerbs: {
      I: { present: 'eat', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers every day.' },
      He: { present: 'eats', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers every day.' },
      They: { present: 'eat', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers every day.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Present)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "DON'T / DOESN'T", type: 'aux' },
          { label: 'Verb (Base)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'DO / DOES', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Base)', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  },
  {
    id: 'simple_past',
    title: '2. Simple Past',
    subjects: ['I', 'He', 'They'],
    dynamicVerbs: {
      I: { present: 'eat', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers yesterday.' },
      He: { present: 'eat', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers yesterday.' },
      They: { present: 'eat', base: 'eat', past: 'ate', participle: 'eaten', ing: 'eating', comp: 'burgers yesterday.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Past -ed/Irreg)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "DIDN'T", type: 'aux' },
          { label: 'Verb (Base)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'DID', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Base)', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  },
  {
    id: 'present_continuous',
    title: '3. Present Continuous',
    subjects: ['I', 'He', 'They'],
    dynamicVerbs: {
      I: { auxPos: 'am', auxNeg: "am not", ing: 'eating', comp: 'burgers right now.' },
      He: { auxPos: 'is', auxNeg: "isn't", ing: 'eating', comp: 'burgers right now.' },
      They: { auxPos: 'are', auxNeg: "aren't", ing: 'eating', comp: 'burgers right now.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'AM / IS / ARE', type: 'aux' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "AM NOT / ISN'T / AREN'T", type: 'aux' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'AM / IS / ARE', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  },
  {
    id: 'past_continuous',
    title: '4. Past Continuous',
    subjects: ['I', 'He', 'They'],
    dynamicVerbs: {
      I: { auxPos: 'was', auxNeg: "wasn't", ing: 'eating', comp: 'burgers.' },
      He: { auxPos: 'was', auxNeg: "wasn't", ing: 'eating', comp: 'burgers.' },
      They: { auxPos: 'were', auxNeg: "weren't", ing: 'eating', comp: 'burgers.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'WAS / WERE', type: 'aux' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "WASN'T / WEREN'T", type: 'aux' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'WAS / WERE', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb-ING', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  },
  {
    id: 'present_perfect',
    title: '5. Present Perfect',
    subjects: ['I', 'Pablo (He)', 'They'],
    dynamicVerbs: {
      'I': { auxPos: 'have', auxNeg: "haven't", participle: 'played', comp: 'soccer.' },
      'Pablo (He)': { auxPos: 'has', auxNeg: "hasn't", participle: 'played', comp: 'soccer.' },
      'They': { auxPos: 'have', auxNeg: "haven't", participle: 'played', comp: 'soccer.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'HAVE / HAS', type: 'aux' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "HAVEN'T / HASN'T", type: 'aux' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'HAVE / HAS', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  },
  {
    id: 'past_perfect',
    title: '6. Past Perfect',
    subjects: ['Pablo (He)', 'I', 'They'],
    dynamicVerbs: {
      'Pablo (He)': { auxPos: 'had', auxNeg: "hadn't", participle: 'played', comp: 'soccer before it rained.' },
      'I': { auxPos: 'had', auxNeg: "hadn't", participle: 'played', comp: 'soccer before it rained.' },
      'They': { auxPos: 'had', auxNeg: "hadn't", participle: 'played', comp: 'soccer before it rained.' }
    },
    formulas: {
      positive: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: 'HAD', type: 'aux' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      negative: {
        structure: [
          { label: 'Subject', type: 'subject' },
          { label: "HADN'T", type: 'aux' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement', type: 'complement' }
        ]
      },
      question: {
        structure: [
          { label: '(Wh-)', type: 'wh' },
          { label: 'HAD', type: 'aux' },
          { label: 'Subject', type: 'subject' },
          { label: 'Verb (Past Participle)', type: 'verb' },
          { label: 'Complement?', type: 'complement' }
        ]
      }
    }
  }
];

const IRREGULAR_VERBS = [
  { base: 'Be (am/is/are)', past: 'was / were', participle: 'been', meaning: 'Ser o Estar' },
  { base: 'Become', past: 'became', participle: 'become', meaning: 'Llegar a ser / Volverse' },
  { base: 'Begin', past: 'began', participle: 'begun', meaning: 'Empezar / Comenzar' },
  { base: 'Break', past: 'broke', participle: 'broken', meaning: 'Romper' },
  { base: 'Bring', past: 'brought', participle: 'brought', meaning: 'Traer' },
  { base: 'Buy', past: 'bought', participle: 'bought', meaning: 'Comprar' },
  { base: 'Come', past: 'came', participle: 'come', meaning: 'Venir' },
  { base: 'Do', past: 'did', participle: 'done', meaning: 'Hacer' },
  { base: 'Drink', past: 'drank', participle: 'drunk', meaning: 'Beber' },
  { base: 'Drive', past: 'drove', participle: 'driven', meaning: 'Manejar / Conducir' },
  { base: 'Eat', past: 'ate', participle: 'eaten', meaning: 'Comer' },
  { base: 'Fly', past: 'flew', participle: 'flown', meaning: 'Volar' },
  { base: 'Forget', past: 'forgot', participle: 'forgotten', meaning: 'Olvidar' },
  { base: 'Get', past: 'got', participle: 'got / gotten', meaning: 'Obtener / Conseguir' },
  { base: 'Give', past: 'gave', participle: 'given', meaning: 'Dar' },
  { base: 'Go', past: 'went', participle: 'gone', meaning: 'Ir' },
  { base: 'Have', past: 'had', participle: 'had', meaning: 'Tener / Haber' },
  { base: 'Know', past: 'knew', participle: 'known', meaning: 'Saber / Conocer' },
  { base: 'Make', past: 'made', participle: 'made', meaning: 'Hacer / Fabricar' },
  { base: 'Read', past: 'read', participle: 'read', meaning: 'Leer' },
  { base: 'Run', past: 'ran', participle: 'run', meaning: 'Correr' },
  { base: 'See', past: 'saw', participle: 'seen', meaning: 'Ver' },
  { base: 'Sing', past: 'sang', participle: 'sung', meaning: 'Cantar' },
  { base: 'Sleep', past: 'slept', participle: 'slept', meaning: 'Dormir' },
  { base: 'Speak', past: 'spoke', participle: 'spoken', meaning: 'Hablar' },
  { base: 'Swim', past: 'swam', participle: 'swum', meaning: 'Nadar' },
  { base: 'Take', past: 'took', participle: 'taken', meaning: 'Tomar / Llevar' },
  { base: 'Teach', past: 'taught', participle: 'taught', meaning: 'Enseñar' },
  { base: 'Think', past: 'thought', participle: 'thought', meaning: 'Pensar' },
  { base: 'Win', past: 'won', participle: 'won', meaning: 'Ganar' },
  { base: 'Write', past: 'wrote', participle: 'written', meaning: 'Escribir' }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    type: 'multiple_choice',
    question: '¿Cuál es la FÓRMULA CORRECTA del "Present Continuous" en Afirmativo?',
    options: [
      'Subject + AM/IS/ARE + Verb-ING + Complement',
      'Subject + Verb (Past) + Complement',
      'Subject + HAVE/HAS + Verb (Participle) + Complement',
      'Subject + DO/DOES + Verb (Base) + Complement'
    ],
    answer: 'Subject + AM/IS/ARE + Verb-ING + Complement',
    formulaHighlight: [
      { text: 'Subject', type: 'subject' },
      { text: 'AM / IS / ARE', type: 'aux' },
      { text: 'Verb-ING', type: 'verb' },
      { text: 'Complement', type: 'complement' }
    ],
    explanation: 'El Present Continuous requiere el verbo To Be (AM/IS/ARE) seguido del verbo con terminación -ING.'
  },
  {
    id: 2,
    type: 'multiple_choice',
    question: '¿Cuál es la estructura correcta para una PREGUNTA en "Simple Past"?',
    options: [
      '(Wh-) + DID + Subject + Verb (Base) + Complement?',
      '(Wh-) + DO/DOES + Subject + Verb-ING + Complement?',
      'Subject + WAS/WERE + Verb (Past) + Complement?',
      'HAD + Subject + Verb-ING + Complement?'
    ],
    answer: '(Wh-) + DID + Subject + Verb (Base) + Complement?',
    formulaHighlight: [
      { text: '(Wh-)', type: 'wh' },
      { text: 'DID', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    explanation: 'En las preguntas de Simple Past, usamos el auxiliar DID. Por eso el verbo principal debe volver a la forma base.'
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: 'En la oración "Pablo HAS played soccer", ¿qué parte de la fórmula es la palabra "HAS"?',
    options: [
      'Auxiliary (Auxiliar del Present Perfect)',
      'Subject (Sujeto)',
      'Verb in Past Participle',
      'Wh- Question Word'
    ],
    answer: 'Auxiliary (Auxiliar del Present Perfect)',
    formulaHighlight: [
      { text: 'Pablo', type: 'subject' },
      { text: 'HAS', type: 'aux' },
      { text: 'played', type: 'verb' },
      { text: 'soccer.', type: 'complement' }
    ],
    explanation: 'En Present Perfect, HAVE / HAS actúa como el AUXILIAR que acompaña al verbo en participio.'
  },
  {
    id: 4,
    type: 'multiple_choice',
    question: 'Identifica la parte que FALTA en la fórmula según la oración: "Where ___ she eat burgers?"',
    promptParts: [
      { text: 'Fórmula:', type: 'none' },
      { text: '(Wh-)', type: 'wh' },
      { text: '[ ??? ]', type: 'aux' },
      { text: 'Subject', type: 'subject' },
      { text: 'Verb (Base)', type: 'verb' },
      { text: 'Complement?', type: 'complement' }
    ],
    options: ['does', 'is', 'has', 'was'],
    answer: 'does',
    formulaHighlight: [
      { text: 'Where', type: 'wh' },
      { text: 'DOES', type: 'aux' },
      { text: 'she', type: 'subject' },
      { text: 'eat', type: 'verb' },
      { text: 'burgers?', type: 'complement' }
    ],
    explanation: 'Para la 3ra persona "she" en pregunta de Present Simple, el auxiliar que falta es DOES.'
  },
  {
    id: 5,
    type: 'multiple_choice',
    question: '¿Qué auxiliar FALTA en la oración en Past Perfect?: "Pablo ___ played soccer before it rained."',
    promptParts: [
      { text: 'Fórmula:', type: 'none' },
      { text: 'Subject', type: 'subject' },
      { text: '[ ??? ]', type: 'aux' },
      { text: 'Verb (Participle)', type: 'verb' },
      { text: 'Complement', type: 'complement' }
    ],
    options: ['had', 'has', 'was', 'did'],
    answer: 'had',
    formulaHighlight: [
      { text: 'Pablo', type: 'subject' },
      { text: 'HAD', type: 'aux' },
      { text: 'played', type: 'verb' },
      { text: 'soccer...', type: 'complement' }
    ],
    explanation: 'El Past Perfect SIEMPRE lleva el auxiliar HAD para todos los sujetos.'
  },
  {
    id: 6,
    type: 'multiple_choice',
    question: 'Elige la palabra Wh- correcta según la respuesta dada:',
    promptParts: [
      { text: '"_____ jacket is this?" ➔ "It is Mary\'s jacket."', type: 'none' }
    ],
    options: ['WHOSE', 'WHO', 'WHICH', 'WHAT TIME'],
    answer: 'WHOSE',
    formulaHighlight: [
      { text: 'WHOSE', type: 'wh' },
      { text: 'jacket is this?', type: 'complement' }
    ],
    explanation: 'WHOSE significa "¿De quién?" y se usa para preguntar sobre el dueño o posesión de un objeto.'
  },
  {
    id: 7,
    type: 'multiple_choice',
    question: 'Preguntando por cantidad de cosas incontables (como agua o jugo):',
    promptParts: [
      { text: '"_____ water do you drink every day?" ➔ "I drink 2 liters."', type: 'none' }
    ],
    options: ['HOW MUCH', 'HOW MANY', 'WHAT TIME', 'WHERE'],
    answer: 'HOW MUCH',
    formulaHighlight: [
      { text: 'HOW MUCH', type: 'wh' },
      { text: 'water...', type: 'complement' }
    ],
    explanation: 'Usamos HOW MUCH para líquidos o cosas incontables. HOW MANY se usa para contables (manzanas, lápices).'
  },
  {
    id: 8,
    type: 'unscramble',
    question: 'Ordena los bloques según la fórmula del Present Perfect Afirmativo:',
    formulaHint: [
      { text: 'Subject', type: 'subject' },
      { text: 'HAVE/HAS', type: 'aux' },
      { text: 'Verb (Participle)', type: 'verb' },
      { text: 'Complement', type: 'complement' }
    ],
    correctOrder: [
      { text: 'Pablo', type: 'subject' },
      { text: 'has', type: 'aux' },
      { text: 'played', type: 'verb' },
      { text: 'soccer.', type: 'complement' }
    ],
    shuffled: [
      { text: 'played', type: 'verb' },
      { text: 'Pablo', type: 'subject' },
      { text: 'soccer.', type: 'complement' },
      { text: 'has', type: 'aux' }
    ]
  }
];

// --- SOUND & SPEECH UTILITIES ---
const playSound = (type: string, enabled = true) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(174.61, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
};

// Convert raw PCM16 audio array to playable WAV blob
const pcm16ToWavBlob = (pcm16Array: Int16Array, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + pcm16Array.length * 2);
  const view = new DataView(buffer);

  // RIFF header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcm16Array.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true);  // AudioFormat (PCM)
  view.setUint16(22, 1, true);  // NumChannels (1)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true);  // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, pcm16Array.length * 2, true);

  // Write PCM data
  let offset = 44;
  for (let i = 0; i < pcm16Array.length; i++, offset += 2) {
    view.setInt16(offset, pcm16Array[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

// Fallback Speech with Gemini TTS API (Kore Voice)
const speakGeminiTTS = async (text: string) => {
  const apiKey = ""; // Runtime automatically injected in browser
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: `Say clearly in natural English with correct grammar pauses: ${text}` }]
    }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" }
        }
      }
    }
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Gemini TTS failed');

  const result = await response.json();
  const part = result?.candidates?.[0]?.content?.parts?.[0];
  const audioData = part?.inlineData?.data;
  const mimeType = part?.inlineData?.mimeType || "audio/L16;rate=24000";

  if (audioData) {
    const sampleRateMatch = mimeType.match(/rate=(\d+)/);
    const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
    
    const binaryString = atob(audioData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pcm16 = new Int16Array(bytes.buffer);
    const wavBlob = pcm16ToWavBlob(pcm16, sampleRate);
    const audioUrl = URL.createObjectURL(wavBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    return true;
  }
  return false;
};

// Fallback Browser Speech Synthesis
const speakNativeBrowser = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.7; // Slower speed for kids
    window.speechSynthesis.speak(utterance);
  }
};

// ElevenLabs Audio Player with Gemini & Native TTS Fallback
const speakTextWithElevenLabs = async (text: string, setLoadingState: ((v: boolean) => void) | null = null) => {
  if (setLoadingState) setLoadingState(true);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API returned status ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      if (setLoadingState) setLoadingState(false);
    };
    audio.onerror = async () => {
      try {
        await speakGeminiTTS(text);
      } catch (err) {
        speakNativeBrowser(text);
      } finally {
        if (setLoadingState) setLoadingState(false);
      }
    };

    await audio.play();
  } catch (error) {
    console.warn('ElevenLabs API request failed, trying Gemini TTS fallback:', error);
    try {
      await speakGeminiTTS(text);
    } catch (err) {
      speakNativeBrowser(text);
    } finally {
      if (setLoadingState) setLoadingState(false);
    }
  }
};

const PillTag = ({ text, type, size = 'md' }: { text: string; type: string; size?: string }) => {
  const meta = COLOR_DICT[type as keyof typeof COLOR_DICT] || { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';
  
  return (
    <span className={`inline-flex items-center font-extrabold border-2 rounded-lg shadow-sm ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses}`}>
      {text}
    </span>
  );
};

// --- MAIN REACT APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('study');
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const level = useMemo(() => Math.floor(stars / 50) + 1, [stars]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeakingLoading, setIsSpeakingLoading] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Simulator State
  const [selectedTenseId, setSelectedTenseId] = useState('present_simple');
  const [selectedSubject, setSelectedSubject] = useState('He');
  const [selectedFormType, setSelectedFormType] = useState('positive');

  // Search & Filter State
  const [verbSearch, setVerbSearch] = useState('');

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [unscrambleSelected, setUnscrambleSelected] = useState<{text: string; type: string}[]>([]);
  const [unscrambleRemaining, setUnscrambleRemaining] = useState<{text: string; type: string}[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeTenseObj = useMemo(() => {
    return TENSES_DATA.find(t => t.id === selectedTenseId) || TENSES_DATA[0];
  }, [selectedTenseId]);

  // Safely retrieve verbData for any tense and selectedSubject
  const getVerbData = () => {
    if (!activeTenseObj || !activeTenseObj.dynamicVerbs) return {} as any;
    const exact = (activeTenseObj.dynamicVerbs as any)[selectedSubject];
    if (exact) return exact;
    
    // Fallback search if subject key differs (e.g., 'He' vs 'Pablo (He)')
    const keys = Object.keys(activeTenseObj.dynamicVerbs);
    if (keys.length > 0) {
      return (activeTenseObj.dynamicVerbs as any)[keys[0]] || {};
    }
    return {};
  };

  const handleTenseChange = (newTenseId: string) => {
    setSelectedTenseId(newTenseId);
    const newTense = TENSES_DATA.find(t => t.id === newTenseId);
    if (newTense && newTense.subjects && newTense.subjects.length > 0) {
      setSelectedSubject(newTense.subjects[0]);
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx] as any;

  // Helper to Render Dynamic Sentence in Simulator and Return Sentence Array
  const getDynamicSentenceParts = () => {
    const verbData = getVerbData();

    if (selectedTenseId === 'present_simple') {
      if (selectedFormType === 'positive') {
        return [
          { text: selectedSubject, type: 'subject' },
          { text: verbData.present || 'eats', type: 'verb' },
          { text: verbData.comp || 'burgers every day.', type: 'complement' }
        ];
      } else if (selectedFormType === 'negative') {
        const aux = selectedSubject === 'He' ? "doesn't" : "don't";
        return [
          { text: selectedSubject, type: 'subject' },
          { text: aux, type: 'aux' },
          { text: verbData.base || 'eat', type: 'verb' },
          { text: verbData.comp || 'burgers every day.', type: 'complement' }
        ];
      } else {
        const aux = selectedSubject === 'He' ? 'Does' : 'Do';
        return [
          { text: 'Where', type: 'wh' },
          { text: aux, type: 'aux' },
          { text: selectedSubject.toLowerCase(), type: 'subject' },
          { text: verbData.base || 'eat', type: 'verb' },
          { text: 'burgers?', type: 'complement' }
        ];
      }
    } else if (selectedTenseId === 'simple_past') {
      if (selectedFormType === 'positive') {
        return [
          { text: selectedSubject, type: 'subject' },
          { text: verbData.past || 'ate', type: 'verb' },
          { text: verbData.comp || 'burgers yesterday.', type: 'complement' }
        ];
      } else if (selectedFormType === 'negative') {
        return [
          { text: selectedSubject, type: 'subject' },
          { text: "didn't", type: 'aux' },
          { text: verbData.base || 'eat', type: 'verb' },
          { text: verbData.comp || 'burgers yesterday.', type: 'complement' }
        ];
      } else {
        return [
          { text: 'Where', type: 'wh' },
          { text: 'did', type: 'aux' },
          { text: selectedSubject === 'He' ? 'he' : selectedSubject === 'They' ? 'they' : 'you', type: 'subject' },
          { text: verbData.base || 'eat', type: 'verb' },
          { text: 'burgers?', type: 'complement' }
        ];
      }
    } else if (selectedTenseId === 'present_continuous' || selectedTenseId === 'past_continuous') {
      const aux = selectedFormType === 'positive' ? (verbData.auxPos || 'is') : (verbData.auxNeg || "isn't");
      if (selectedFormType === 'question') {
        return [
          { text: 'When', type: 'wh' },
          { text: verbData.auxPos || 'is', type: 'aux' },
          { text: selectedSubject.toLowerCase(), type: 'subject' },
          { text: verbData.ing || 'eating', type: 'verb' },
          { text: 'burgers?', type: 'complement' }
        ];
      }
      return [
        { text: selectedSubject, type: 'subject' },
        { text: aux, type: 'aux' },
        { text: verbData.ing || 'eating', type: 'verb' },
        { text: verbData.comp || 'burgers.', type: 'complement' }
      ];
    } else if (selectedTenseId === 'present_perfect' || selectedTenseId === 'past_perfect') {
      const aux = selectedFormType === 'positive' ? (verbData.auxPos || 'has') : (verbData.auxNeg || "hasn't");
      const subjDisplay = selectedSubject.includes('Pablo') ? 'Pablo' : selectedSubject;
      if (selectedFormType === 'question') {
        return [
          { text: 'Where', type: 'wh' },
          { text: verbData.auxPos || 'has', type: 'aux' },
          { text: subjDisplay, type: 'subject' },
          { text: verbData.participle || 'played', type: 'verb' },
          { text: 'soccer?', type: 'complement' }
        ];
      }
      return [
        { text: subjDisplay, type: 'subject' },
        { text: aux, type: 'aux' },
        { text: verbData.participle || 'played', type: 'verb' },
        { text: verbData.comp || 'soccer.', type: 'complement' }
      ];
    }

    return [];
  };

  const renderDynamicSentence = () => {
    const parts = getDynamicSentenceParts();
    return (
      <div className="flex flex-wrap items-center gap-2">
        {parts.map((p, idx) => (
          <PillTag key={idx} text={p.text} type={p.type} />
        ))}
      </div>
    );
  };

  const speakGeneratedSentence = () => {
    const parts = getDynamicSentenceParts();
    const fullSentence = parts.map(p => p.text).join(' ');
    speakTextWithElevenLabs(fullSentence, setIsSpeakingLoading);
  };

  const speakItemWithElevenLabs = (text: string, itemId: string) => {
    setActiveSpeakingId(itemId);
    
    // Check if item is an irregular verb to preserve ElevenLabs quota
    if (typeof itemId === 'string' && itemId.startsWith('verb-')) {
      speakNativeBrowser(text);
      setTimeout(() => setActiveSpeakingId(null), 1200);
      return;
    }

    speakTextWithElevenLabs(text, (loading) => {
      if (!loading) setActiveSpeakingId(null);
    });
  };

  const handleAddBlock = (block: {text: string; type: string}, index: number) => {
    if (isAnswered) return;
    setUnscrambleSelected(prev => [...prev, block]);
    setUnscrambleRemaining(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveBlock = (block: {text: string; type: string}, index: number) => {
    if (isAnswered) return;
    setUnscrambleRemaining(prev => [...prev, block]);
    setUnscrambleSelected(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    let correct = false;
    if (currentQuestion.type === 'unscramble') {
      const userText = unscrambleSelected.map((b: any) => b.text).join(' ');
      const targetText = currentQuestion.correctOrder.map((b: any) => b.text).join(' ');
      correct = userText === targetText;
    } else {
      correct = selectedAnswer === currentQuestion.answer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    playSound(correct ? 'correct' : 'error', soundEnabled);

    if (correct) {
      setStars(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      if (QUIZ_QUESTIONS[nextIdx].type === 'unscramble') {
        setUnscrambleSelected([]);
        setUnscrambleRemaining([...(QUIZ_QUESTIONS[nextIdx] as any).shuffled]);
      }
    } else {
      setQuizFinished(true);
    }
  };

  const filteredVerbs = useMemo(() => {
    if (!verbSearch) return IRREGULAR_VERBS;
    const q = verbSearch.toLowerCase();
    return IRREGULAR_VERBS.filter(v => 
      v.base.toLowerCase().includes(q) || 
      v.past.toLowerCase().includes(q) || 
      v.meaning.toLowerCase().includes(q)
    );
  }, [verbSearch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 pb-12">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2.5 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Grammar Tenses Explorer 🚀
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Aprende Fórmulas &amp; Wh- Questions (Voice: Rachel ✨)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center space-x-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-amber-800 dark:text-amber-200 text-xs">{stars}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-700 px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-extrabold text-orange-800 dark:text-orange-200 text-xs">{streak}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-extrabold text-indigo-800 dark:text-indigo-200 text-xs uppercase">Niv {level}</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 flex border-t border-slate-100 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex-1 py-3 font-bold text-sm md:text-base flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'study'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>1. Guía Visual Interactiva</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 font-bold text-sm md:text-base flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>2. Cuestionario de Fórmulas</span>
          </button>
        </div>
      </header>

      {/* CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 mt-6">

        {activeTab === 'study' && (
          <div className="space-y-8">
            
            {/* Color Legend */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-2">
                🎨 Diccionario y Código de Colores Universal para Fórmulas
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <PillTag text="Subject (Sujeto)" type="subject" />
                <PillTag text="Auxiliary / To Be" type="aux" />
                <PillTag text="Verb (Verbo)" type="verb" />
                <PillTag text="Complement (Complemento)" type="complement" />
                <PillTag text="(Wh-) Question Word" type="wh" />
              </div>
            </div>

            {/* Wh- Explorer */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>❓</span> Wh- Question Words Explorer
                  </h2>
                  <p className="text-xs text-slate-500">Haz clic en el botón de audio 🎙️ para escuchar la voz ultra realista con ElevenLabs.</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-3 py-1 rounded-full">
                  11 Palabras
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {WH_WORDS.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-orange-200 dark:border-orange-950 hover:shadow-md transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-black text-orange-600 dark:text-orange-400 text-lg">
                            {item.word}
                          </span>
                        </div>
                        <button
                          onClick={() => speakItemWithElevenLabs(`${item.word}. ${item.example}`, item.id)}
                          disabled={activeSpeakingId === item.id}
                          className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 hover:scale-110 transition-transform disabled:opacity-50"
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
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                        "{item.example}"
                      </p>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900 font-semibold">
                        💡 {item.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIMULATOR */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-indigo-500 shadow-md space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    Simulador Dinámico de Fórmulas en Tiempo Real
                  </h2>
                  <p className="text-xs text-slate-500">Cambia el tiempo verbal, sujeto o tipo para ver cómo la fórmula construye la oración.</p>
                </div>

                <select
                  value={selectedTenseId}
                  onChange={(e) => handleTenseChange(e.target.value)}
                  className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 text-xs font-black rounded-xl px-4 py-2 border-2 border-indigo-300 dark:border-indigo-700"
                >
                  {TENSES_DATA.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                
                <div>
                  <span className="block text-xs font-black text-slate-500 mb-2 uppercase">1. Selecciona el Sujeto:</span>
                  <div className="flex gap-2">
                    {activeTenseObj.subjects.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSubject(s)}
                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                          selectedSubject === s
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-black text-slate-500 mb-2 uppercase">2. Tipo de Oración:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'positive', label: '+ Afirmativo' },
                      { id: 'negative', label: '- Negativo' },
                      { id: 'question', label: '? Pregunta' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedFormType(t.id)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                          selectedFormType === t.id
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-extrabold text-slate-400 mb-2 uppercase">Estructura teórica de la Fórmula:</span>
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    {activeTenseObj.formulas[selectedFormType as keyof typeof activeTenseObj.formulas].structure.map((item, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-slate-400 font-extrabold text-xs">+</span>}
                        <PillTag text={item.label} type={item.type} size="sm" />
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-5 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">Oración Generada en Tiempo Real:</span>
                    {renderDynamicSentence()}
                  </div>

                  <button
                    onClick={speakGeneratedSentence}
                    disabled={isSpeakingLoading}
                    className="self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                  >
                    {isSpeakingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generando Voz...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Escuchar con Rachel ✨</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Extra Reference */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Spelling Rules Cards */}
              <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2">
                  <span>📌</span> Reglas de Ortografía (-ING / -ED)
                </h3>
                
                <div className="space-y-4 text-sm md:text-base">
                  <div className="bg-slate-50 dark:bg-slate-900/70 p-4 md:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 block mb-2 text-base md:text-lg">
                      🌀 Regla para agregar -ING:
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                      <li><strong>General:</strong> Agrega <em>-ing</em> ➔ <span className="text-indigo-700 dark:text-indigo-300 font-bold">play ➔ playing</span></li>
                      <li><strong>Terminados en -E:</strong> Quita la -e y agrega <em>-ing</em> ➔ <span className="text-indigo-700 dark:text-indigo-300 font-bold">danc<u>e</u> ➔ dancing</span></li>
                      <li><strong>Consonante + Vocal + Consonante:</strong> Dobla consonante ➔ <span className="text-indigo-700 dark:text-indigo-300 font-bold">ru<u>n</u> ➔ ru<u>nn</u>ing</span></li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/70 p-4 md:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 block mb-2 text-base md:text-lg">
                      📌 Regla para agregar -ED (Pasado):
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                      <li><strong>General:</strong> Agrega <em>-ed</em> ➔ <span className="text-emerald-700 dark:text-emerald-300 font-bold">walk ➔ walked</span></li>
                      <li><strong>Terminados en -E:</strong> Solo agrega <em>-d</em> ➔ <span className="text-emerald-700 dark:text-emerald-300 font-bold">lik<u>e</u> ➔ liked</span></li>
                      <li><strong>Consonante + Y:</strong> Cambia Y por <em>-ied</em> ➔ <span className="text-emerald-700 dark:text-emerald-300 font-bold">stud<u>y</u> ➔ stud<u>ied</u></span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Irregular Verbs Table */}
              <div className="bg-white dark:bg-slate-800 p-6 md:p-7 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2">
                      <span>📖</span> Verbos Irregulares Comunes
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
                  {filteredVerbs.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
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
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!quizFinished ? (
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                    Pregunta {currentQuestionIdx + 1} de {QUIZ_QUESTIONS.length}
                  </span>
                  <div className="w-36 bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100">
                    {currentQuestion.question}
                  </h3>

                  {currentQuestion.promptParts && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl flex flex-wrap items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                      {currentQuestion.promptParts.map((part: any, i: number) => (
                        part.type === 'none' ? (
                          <span key={i} className="text-xs font-black text-slate-600 dark:text-slate-300 mr-1">
                            {part.text}
                          </span>
                        ) : (
                          <PillTag key={i} text={part.text} type={part.type} size="sm" />
                        )
                      ))}
                    </div>
                  )}

                  {currentQuestion.formulaHint && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <span>💡 Pista de Fórmula:</span>
                      <div className="flex flex-wrap items-center gap-1">
                        {Array.isArray(currentQuestion.formulaHint) ? (
                          currentQuestion.formulaHint.map((item: any, i: number) => (
                            <React.Fragment key={i}>
                              {i > 0 && <span className="text-slate-400 font-extrabold">+</span>}
                              <PillTag text={item.text} type={item.type} size="sm" />
                            </React.Fragment>
                          ))
                        ) : (
                          <span className="italic">{currentQuestion.formulaHint}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Question Type: Unscramble */}
                {currentQuestion.type === 'unscramble' ? (
                  <div className="space-y-4">
                    {/* Selected Zone */}
                    <div className="min-h-16 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border-2 border-dashed border-indigo-300 dark:border-indigo-700 flex flex-wrap gap-2 items-center">
                      {unscrambleSelected.length === 0 && (
                        <span className="text-xs font-bold text-indigo-400 italic">Toca los bloques de abajo para armar la oración...</span>
                      )}
                      {unscrambleSelected.map((block, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRemoveBlock(block, idx)}
                          className="animate-fadeIn"
                        >
                          <PillTag text={block.text} type={block.type} />
                        </button>
                      ))}
                    </div>

                    {/* Remaining Blocks */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {unscrambleRemaining.map((block, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddBlock(block, idx)}
                          className="hover:scale-105 transition-transform"
                        >
                          <PillTag text={block.text} type={block.type} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Question Type: Multiple Choice */
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt: string, i: number) => {
                      let btnStyle = "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300";
                      
                      if (selectedAnswer === opt) {
                        btnStyle = "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20";
                      }

                      if (isAnswered) {
                        if (opt === currentQuestion.answer) {
                          btnStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold";
                        } else if (selectedAnswer === opt) {
                          btnStyle = "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={isAnswered}
                          onClick={() => setSelectedAnswer(opt)}
                          className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && opt === currentQuestion.answer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          )}
                          {isAnswered && selectedAnswer === opt && opt !== currentQuestion.answer && (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Feedback Explanation Banner */}
                {isAnswered && (
                  <div className={`p-4 rounded-2xl border-2 space-y-3 animate-fadeIn ${
                    isCorrect 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
                  }`}>
                    <div className="flex items-center space-x-2 font-black text-sm">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>¡Excelente! Respuesta Correcta +10 Estrellas</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600" />
                          <span>¡Casi! Revisa la explicación de la fórmula</span>
                        </>
                      )}
                    </div>

                    {currentQuestion.formulaHighlight && (
                      <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="text-[11px] font-black uppercase text-slate-500 block">Fórmula Destacada:</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {Array.isArray(currentQuestion.formulaHighlight) ? (
                            currentQuestion.formulaHighlight.map((item: any, i: number) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span className="text-slate-400 font-extrabold text-xs">+</span>}
                                <PillTag text={item.text} type={item.type} size="sm" />
                              </React.Fragment>
                            ))
                          ) : (
                            <span className="font-bold text-xs">{currentQuestion.formulaHighlight}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {currentQuestion.explanation && (
                      <p className="text-xs font-medium leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit / Next Button */}
                <div className="pt-2 flex justify-end">
                  {!isAnswered ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={currentQuestion.type === 'unscramble' ? unscrambleSelected.length === 0 : !selectedAnswer}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center space-x-2"
                    >
                      <span>Comprobar Respuesta</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center space-x-2"
                    >
                      <span>Siguiente Pregunta</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-6">
                <div className="inline-flex p-4 bg-amber-100 dark:bg-amber-950/80 rounded-full text-amber-500 mb-2">
                  <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  ¡Cuestionario Completado! 🎉
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Has practicado las Fórmulas de Tiempos Verbales y Wh- Question Words con éxito.
                </p>

                <div className="flex justify-center items-center space-x-6 py-4">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-amber-500">+{stars}</span>
                    <span className="text-xs font-bold text-slate-400">Estrellas</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-orange-500">{streak}</span>
                    <span className="text-xs font-bold text-slate-400">Racha</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentQuestionIdx(0);
                    setSelectedAnswer(null);
                    setIsAnswered(false);
                    setQuizFinished(false);
                    setUnscrambleSelected([]);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl shadow-md transition-all inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Volver a Intentar</span>
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-12 text-center text-xs font-bold text-slate-400">
        <p>
          Powered by{' '}
          <a
            href="http://josuemancilla.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-black"
          >
            Josue Mancilla
          </a>
        </p>
      </footer>

    </div>
  );
}
