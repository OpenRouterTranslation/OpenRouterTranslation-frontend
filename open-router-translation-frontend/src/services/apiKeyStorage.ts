// Secure client-side API key storage using Web Crypto API and IndexedDB

const DB_NAME = 'SubtitleTranslatorDB';
const STORE_NAME = 'apiKeys';
const KEY_ID = 'openrouter_key';
const SALT_ID = 'encryption_salt';

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

// Get or create a salt for key derivation
const getSalt = async (db: IDBDatabase): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(SALT_ID);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                // Generate new salt
                const salt = crypto.getRandomValues(new Uint8Array(16));
                const writeTx = db.transaction(STORE_NAME, 'readwrite');
                const writeStore = writeTx.objectStore(STORE_NAME);
                writeStore.put(salt, SALT_ID);
                writeTx.oncomplete = () => resolve(salt);
                writeTx.onerror = () => reject(writeTx.error);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

// Derive encryption key from passphrase (browser fingerprint)
const deriveKey = async (salt: Uint8Array): Promise<CryptoKey> => {
    // Create a semi-unique identifier from browser characteristics
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset().toString(),
        screen.colorDepth.toString(),
        screen.width.toString(),
        screen.height.toString()
    ].join('|');

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(fingerprint),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

// Encrypt API key
const encryptKey = async (apiKey: string): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> => {
    const db = await initDB();
    const salt = await getSalt(db);
    const key = await deriveKey(salt);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(apiKey)
    );

    db.close();
    return { encrypted, iv };
};

// Decrypt API key
const decryptKey = async (encrypted: ArrayBuffer, iv: Uint8Array): Promise<string> => {
    const db = await initDB();
    const salt = await getSalt(db);
    const key = await deriveKey(salt);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    );

    db.close();
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
};

// Public API
export const apiKeyStorage = {
    // Save API key
    async saveApiKey(apiKey: string): Promise<void> {
        try {
            const { encrypted, iv } = await encryptKey(apiKey);

            const db = await initDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // Store both encrypted data and IV
            store.put({ encrypted, iv }, KEY_ID);

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
                transaction.onerror = () => {
                    db.close();
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error('Error saving API key:', error);
            throw new Error('Failed to save API key');
        }
    },

    // Get decrypted API key
    async getApiKey(): Promise<string | null> {
        try {
            const db = await initDB();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(KEY_ID);

            return new Promise((resolve, reject) => {
                request.onsuccess = async () => {
                    db.close();
                    if (request.result) {
                        try {
                            const { encrypted, iv } = request.result;
                            const decrypted = await decryptKey(encrypted, iv);
                            resolve(decrypted);
                        } catch (error) {
                            console.error('Error decrypting API key:', error);
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => {
                    db.close();
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error retrieving API key:', error);
            return null;
        }
    },

    // Check if API key exists
    async hasApiKey(): Promise<boolean> {
        try {
            const db = await initDB();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(KEY_ID);

            return new Promise((resolve) => {
                request.onsuccess = () => {
                    db.close();
                    resolve(!!request.result);
                };
                request.onerror = () => {
                    db.close();
                    resolve(false);
                };
            });
        } catch (error) {
            console.error('Error checking API key:', error);
            return false;
        }
    },

    // Delete API key
    async deleteApiKey(): Promise<void> {
        try {
            const db = await initDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(KEY_ID);

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    db.close();
                    resolve();
                };
                transaction.onerror = () => {
                    db.close();
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error('Error deleting API key:', error);
            throw new Error('Failed to delete API key');
        }
    }
};