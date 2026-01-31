
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy
} from 'firebase/firestore';

// CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Verificación estricta para evitar que el SDK de Firebase intente conectar con datos de ejemplo
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "TU_API_KEY" && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "TU_PROYECTO_ID";

let db: any = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Error inicializando Firebase:", e);
  }
}

// CONFIGURACIÓN DE CLOUDINARY
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET_UNSIGNED";
const isCloudinaryConfigured = 
  CLOUDINARY_CLOUD_NAME && 
  CLOUDINARY_CLOUD_NAME !== "TU_CLOUD_NAME";

/**
 * Sube una imagen a Cloudinary o devuelve el base64 si no hay configuración real
 */
export const uploadToCloudinary = async (base64: string): Promise<string> => {
  if (!base64 || !base64.startsWith('data:image')) return base64;
  
  if (!isCloudinaryConfigured) {
    return base64;
  }
  
  try {
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.secure_url) return data.secure_url;
    throw new Error(data.error?.message || "Error en respuesta de Cloudinary");
  } catch (error) {
    console.error("Error subiendo a Cloudinary:", error);
    return base64;
  }
};

/**
 * Almacenamiento Local (LocalStorage)
 */
const localDB = {
  get(collectionName: string) {
    const data = localStorage.getItem(`gora_${collectionName}`);
    return data ? JSON.parse(data) : [];
  },
  save(collectionName: string, items: any[]) {
    localStorage.setItem(`gora_${collectionName}`, JSON.stringify(items));
  }
};

/**
 * Servicio de Base de Datos Unificado
 */
export const dbService = {
  async getAll(collectionName: string) {
    let items: any[] = [];

    if (!isFirebaseConfigured || !db) {
      items = localDB.get(collectionName);
    } else {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      } catch (e) {
        console.error(`Error en Firestore ${collectionName}:`, e);
        items = localDB.get(collectionName);
      }
    }

    /**
     * EXTRACTOR DE AÑO INTELIGENTE
     * Intenta obtener un año numérico de cualquier campo posible
     */
    const getSortYear = (item: any) => {
      // 1. Prioridad: campo 'año' numérico (Cantineras)
      if (typeof item.año === 'number') return item.año;
      if (item.año && !isNaN(Number(item.año))) return Number(item.año);
      
      // 2. Buscar año en campos de texto (Mandos 'años', Noticias 'date', Inscripciones 'fecha')
      const textToSearch = [item.años, item.date, item.fecha].filter(Boolean).join(' ');
      const match = textToSearch.match(/\d{4}/); // Busca los primeros 4 dígitos consecutivos
      if (match) return Number(match[0]);
      
      return 0;
    };

    // LÓGICA DE ORDENACIÓN: Más reciente primero (Descendente)
    return items.sort((a, b) => {
      const yearA = getSortYear(a);
      const yearB = getSortYear(b);

      // Si los años son distintos, ordenamos por año
      if (yearA !== yearB) return yearB - yearA;

      // Si el año es igual (o no hay año), ordenamos por fecha de creación técnica
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  },

  async add(collectionName: string, data: any) {
    const newItem = {
      ...data,
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      const itemWithId = { ...newItem, id: Date.now().toString() };
      localDB.save(collectionName, [itemWithId, ...items]);
      return itemWithId;
    }

    try {
      return await addDoc(collection(db, collectionName), newItem);
    } catch (e) {
      const items = localDB.get(collectionName);
      const itemWithId = { ...newItem, id: Date.now().toString() };
      localDB.save(collectionName, [itemWithId, ...items]);
      return itemWithId;
    }
  },

  async update(collectionName: string, id: string, data: any) {
    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      const index = items.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
        localDB.save(collectionName, items);
      }
      return;
    }

    try {
      const ref = doc(db, collectionName, id);
      const { id: _, ...cleanData } = data;
      return await updateDoc(ref, { ...cleanData, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.error("Error actualizando Firestore:", e);
    }
  },

  async delete(collectionName: string, id: string) {
    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      localDB.save(collectionName, items.filter((item: any) => item.id !== id));
      return;
    }

    try {
      const ref = doc(db, collectionName, id);
      return await deleteDoc(ref);
    } catch (e) {
      console.error("Error eliminando en Firestore:", e);
    }
  }
};
