
export type ViewState = 'home' | 'triage' | 'evidence' | 'tracking' | 'library' | 'map' | 'emergency' | 'corruption-form' | 'officer-check' | 'info-request' | 'transparency-map';

export interface LegalArticle {
  id: string;
  title: string;
  code: 'Penal' | 'Civil' | 'Constitución' | 'Anticorrupción';
  article: string;
  content: string;
  keywords: string[];
}

export interface Report {
  id: string;
  type: string;
  status: 'Radicado' | 'Asignado' | 'Investigación' | 'Resolución';
  date: string;
  location: { lat: number; lng: number };
  description: string;
}

export interface TriageStep {
  id: string;
  question: string;
  options: {
    label: string;
    nextStepId?: string;
    result?: string;
    resultDetails?: {
      article?: string;
      pena?: string;
      destination?: string;
      competencia?: string;
      convencion?: string;
      action?: string;
      documentation?: string;
    };
    classification?: string;
  }[];
}
