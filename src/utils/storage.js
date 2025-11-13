// 本地儲存 API (模擬 Claude.ai 的 window.storage)
export const storage = {
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { success: true };
    } catch (error) {
      console.error("Storage set error:", error);
      throw error;
    }
  },

  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (error) {
      console.error("Storage get error:", error);
      throw error;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error("Storage delete error:", error);
      throw error;
    }
  },

  async list(prefix) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys };
    } catch (error) {
      console.error("Storage list error:", error);
      throw error;
    }
  },

  async clear() {
    try {
      localStorage.clear();
      return { success: true };
    } catch (error) {
      console.error("Storage clear error:", error);
      throw error;
    }
  },
};

// 掛載到 window 上 (如果需要)
if (typeof window !== "undefined") {
  window.storage = storage;
}
