
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

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
    console.warn("Firebase no configurado, usando almacenamiento local.");
  }
}

const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "TU_UPLOAD_PRESET_UNSIGNED";
const isCloudinaryConfigured = 
  CLOUDINARY_CLOUD_NAME && 
  CLOUDINARY_CLOUD_NAME !== "TU_CLOUD_NAME";

export const optimizeImage = (base64Str: string, maxWidth = 400, maxHeight = 400, quality = 0.5): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      } else {
        if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
};

export const uploadToCloudinary = async (base64: string): Promise<string> => {
  if (!base64 || !base64.startsWith('data:image') || !isCloudinaryConfigured) return base64;
  try {
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.secure_url || base64;
  } catch (error) {
    return base64;
  }
};

const localDB = {
  get(collectionName: string) {
    const data = localStorage.getItem(`gora_${collectionName}`);
    return data ? JSON.parse(data) : [];
  },
  save(collectionName: string, items: any[]) {
    try {
      localStorage.setItem(`gora_${collectionName}`, JSON.stringify(items));
      return true;
    } catch (e) {
      return false;
    }
  },
  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gora_')) localStorage.removeItem(key);
    });
    window.location.reload();
  }
};

export const dbService = {
  clearStorage() { localDB.clearAll(); },

  async getAll(collectionName: string) {
    let items: any[] = [];
    if (!isFirebaseConfigured || !db) {
      items = localDB.get(collectionName);
    } else {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      } catch (e) {
        items = localDB.get(collectionName);
      }
    }
    return items.sort((a, b) => {
      const yearA = Number(a.year || a.año) || 0;
      const yearB = Number(b.year || b.año) || 0;
      return yearB - yearA;
    });
  },

  async add(collectionName: string, data: any) {
    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      const itemWithId = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
      const success = localDB.save(collectionName, [itemWithId, ...items]);
      if (!success) throw new Error("QUOTA_EXCEEDED");
      return itemWithId;
    }
    return await addDoc(collection(db, collectionName), { ...data, createdAt: new Date().toISOString() });
  },

  async update(collectionName: string, id: string, data: any) {
    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      const index = items.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
        const success = localDB.save(collectionName, items);
        if (!success) throw new Error("QUOTA_EXCEEDED");
      }
      return;
    }
    const ref = doc(db, collectionName, id);
    const { id: _, ...cleanData } = data;
    await updateDoc(ref, { ...cleanData, updatedAt: new Date().toISOString() });
  },

  async delete(collectionName: string, id: string) {
    if (!isFirebaseConfigured || !db) {
      const items = localDB.get(collectionName);
      localDB.save(collectionName, items.filter((item: any) => item.id !== id));
      return;
    }
    await deleteDoc(doc(db, collectionName, id));
  }
};
