
export type ViewState = 'home' | 'triage' | 'evidence' | 'tracking' | 'library' | 'map' | 'emergency';

export interface LegalArticle {
  id: string;
  title: string;
  code: 'Penal' | 'Civil' | 'Constitución';
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
    classification?: string;
  }[];
}
