// IndexedDB and Compression service for permanent image persistence

const DB_NAME = 'TeacherVevianJoyGiftDB';
const STORE_NAME = 'permanent_photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePermanentPhoto(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage only', err);
  }
}

export async function getPermanentPhotos(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const photos: Record<string, string> = {};

    return new Promise((resolve) => {
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          photos[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve(photos);
        }
      };
      cursorRequest.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Compresses camera photos from modern smartphones (often 10MB+) down to
 * crisp, display-optimized images (~150KB) so they fit permanently in storage
 * and never trigger QuotaExceededError.
 */
export async function compressPhoto(file: File, maxDimension = 1600, quality = 0.86): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        // Draw and compress to clean JPEG
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(result); // Fallback to raw if decoding fails
      img.src = result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Fetches all photos saved on the server disk.
 * Allows ANY person opening the shared link to see the photos immediately.
 */
export async function fetchServerPhotos(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/photos');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch server photos', e);
  }
  return {};
}

/**
 * Saves a photo permanently onto the server disk.
 * This guarantees the photo will never disappear when sharing the link with anyone.
 */
export async function savePhotoToServer(id: string, base64: string): Promise<string | null> {
  try {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, base64 }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (err) {
    console.warn('Failed to upload to server, saved in local IndexedDB', err);
  }
  return null;
}

