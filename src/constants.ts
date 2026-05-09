
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
  },
  {
    id: '4',
    code: 'Penal',
    title: 'Cohecho Pasivo Propio',
    article: 'Art. 393',
    content: 'El funcionario o servidor público que acepte o reciba donativo, promesa o cualquier otra ventaja o beneficio para realizar u omitir un acto en violación de sus obligaciones...',
    keywords: ['coima', 'soborno', 'funcionario']
  },
  {
    id: '5',
    code: 'Penal',
    title: 'Peculado',
    article: 'Art. 387',
    content: 'El funcionario o servidor público que se apropia o utiliza, en cualquier forma, para sí o para otro, caudales o efectos cuya percepción, administración o custodia le estén confiados por razón de su cargo...',
    keywords: ['fondos públicos', 'apropiación', 'peculado']
  },
  {
    id: '6',
    code: 'Anticorrupción',
    title: 'Ley del Servicio Civil',
    article: 'Ley 30057',
    content: 'Establece un régimen único y exclusivo para las personas que prestan servicios en las entidades públicas del Estado...',
    keywords: ['meritocracia', 'servicio civil', 'ética']
  },
  {
    id: '7',
    code: 'Anticorrupción',
    title: 'UNCAC (ONU)',
    article: 'Convención',
    content: 'La Convención de las Naciones Unidas contra la Corrupción es el único instrumento jurídico universal contra la corrupción con carácter vinculante...',
    keywords: ['onu', 'global', 'anticorrupción']
  },
  {
    id: '8',
    code: 'Anticorrupción',
    title: 'CICC (OEA)',
    article: 'Convención',
    content: 'Convención Interamericana contra la Corrupción. Promover y fortalecer los mecanismos necesarios para prevenir, detectar, sancionar y erradicar la corrupción...',
    keywords: ['oea', 'interamericana', 'cooperación']
  }
];

export const TRIAGE_FLOW: Record<string, TriageStep> = {
  start: {
    id: 'start',
    question: '¿Qué tipo de incidente desea reportar?',
    options: [
      { label: 'Contra el Patrimonio (Robo/Hurto)', nextStepId: 'patrimonio' },
      { label: 'Corrupción o Abuso de Autoridad', nextStepId: 'corrupcion' },
      { label: 'Contra la Integridad Física', nextStepId: 'integridad' },
      { label: 'Otro', nextStepId: 'otro' }
    ]
  },
  corrupcion: {
    id: 'corrupcion',
    question: '¿Cuál es la naturaleza del acto irregular?',
    options: [
      { label: 'Solicitud de beneficio/coima (Cohecho)', result: 'Cohecho (Art. 393-398 CP)', classification: 'Grave' },
      { label: 'Uso indebido de fondos/recursos (Peculado)', result: 'Peculado (Art. 387 CP)', classification: 'Grave' },
      { label: 'Abuso de autoridad / Discriminación', result: 'Abuso de Autoridad (Art. 376 CP)', classification: 'Moderado' },
      { label: 'Tráfico de influencias / Nepotismo', result: 'Tráfico de Influencias (Art. 400 CP)', classification: 'Muy Grave' }
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
