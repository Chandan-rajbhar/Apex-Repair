/* ==========================================================================
   Apex Storage Service - LocalStorage & Cross-Tab Synchronization
   ========================================================================== */

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom storage event for the same tab
      window.dispatchEvent(new CustomEvent('apex_storage_change', {
        detail: { key, value }
      }));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('apex_storage_change', {
        detail: { key, value: null }
      }));
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  },

  /**
   * Listen for updates both across tabs (native 'storage' event)
   * and within the same window ('apex_storage_change' custom event).
   */
  subscribe(targetKey, callback) {
    const handleNative = (e) => {
      if (e.key === targetKey && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          callback(e.newValue);
        }
      }
    };

    const handleCustom = (e) => {
      if (e.detail.key === targetKey) {
        callback(e.detail.value);
      }
    };

    window.addEventListener('storage', handleNative);
    window.addEventListener('apex_storage_change', handleCustom);

    return () => {
      window.removeEventListener('storage', handleNative);
      window.removeEventListener('apex_storage_change', handleCustom);
    };
  }
};

