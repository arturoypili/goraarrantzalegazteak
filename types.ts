
export interface NavItem {
  label: string;
  href: string;
}

export interface Mando {
  id: string;
  nombre: string;
  apellidos: string;
  puesto: string;
  años: string;
  foto: string;
}

export interface Cantinera {
  id: string;
  nombre: string;
  apellidos: string;
  año: number;
  foto: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  images?: string[]; // Ahora es una lista de fotos
  year?: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

export interface Inscription {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  tlf: string;
  cuenta: string;
  puesto: string;
  escopeta_tipo?: string;
  numero_serie?: string;
  comentarios: string;
  fecha: string;
}
