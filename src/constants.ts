
import { LegalArticle, TriageStep } from './types';

export const LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: '1',
    code: 'Penal',
    title: 'Hurto',
    article: 'Art. 185',
    content: 'El que, para obtener un provecho, se apodera ilegítimamente de un bien mueble, total o parcialmente ajeno, sustrayéndolo del lugar donde se encuentra...',
    keywords: ['robo', 'sustracción', 'bien mueble']
  },
  {
    id: '2',
    code: 'Penal',
    title: 'Robo Agravado',
    article: 'Art. 189',
    content: 'La pena será no menor de doce ni mayor de veinte años si el robo es cometido: 1. En casa habitada. 2. Durante la noche. 3. Mediante el concurso de dos o más personas. 4. Con armas...',
    keywords: ['armas', 'noche', 'violencia']
  },
  {
    id: '3',
    code: 'Constitución',
    title: 'Derecho a la Libertad',
    article: 'Art. 2',
    content: 'Toda persona tiene derecho: 1. A la vida, a su identidad, a su integridad moral, psíquica y física y a su libre desarrollo y bienestar...',
    keywords: ['vida', 'libertad', 'identidad']
  }
];

export const TRIAGE_FLOW: Record<string, TriageStep> = {
  start: {
    id: 'start',
    question: '¿Qué tipo de incidente desea reportar?',
    options: [
      { label: 'Contra el Patrimonio (Robo/Hurto)', nextStepId: 'patrimonio' },
      { label: 'Contra la Integridad Física', nextStepId: 'integridad' },
      { label: 'Otro', nextStepId: 'otro' }
    ]
  },
  patrimonio: {
    id: 'patrimonio',
    question: '¿Hubo violencia o amenaza contra las personas?',
    options: [
      { label: 'Sí, hubo violencia física/amenaza', nextStepId: 'robo_armas' },
      { label: 'No, fue sin violencia directa', nextStepId: 'hurto_valor' }
    ]
  },
  robo_armas: {
    id: 'robo_armas',
    question: '¿Se utilizaron armas (fuego, blanca)?',
    options: [
      { label: 'Sí', result: 'Robo Agravado (Art. 189 CP)', classification: 'Grave' },
      { label: 'No', result: 'Robo (Art. 188 CP)', classification: 'Moderado' }
    ]
  },
  hurto_valor: {
    id: 'hurto_valor',
    question: '¿El valor de lo sustraído supera una Remuneración Mínima Vital?',
    options: [
      { label: 'Sí', result: 'Hurto simple (Art. 185 CP)', classification: 'Leve' },
      { label: 'No', result: 'Falta contra el patrimonio', classification: 'Falta' }
    ]
  }
};
