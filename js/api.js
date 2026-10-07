/**
 * ============================================================================
 * KOPI KREMA NBX — API CLIENT LAYER (js/api.js)
 * Jembatan komunikasi data antara Frontend GitHub Pages dan Google Apps Script
 * Menggunakan Simple POST Request (Bypass CORS Preflight OPTIONS)
 * ============================================================================
 */

const API = {
  /**
   * Pemanggilan generic ke Google Apps Script backend
   */
  async request(action, data = {}) {
    const gasUrl = CONFIG.GAS_URL;

    // Jika URL belum diganti (masih placeholder), gunakan mode offline demo
    if (!gasUrl || gasUrl.includes('GANTI_DENGAN_URL_DEPLOYMENT_GAS_ANDA')) {
      console.warn('⚡ [API Client] GAS_URL masih placeholder di js/config.js. Berjalan dalam mode demo lokal.');
      return { success: true, isDemo: true, data: null, message: 'Demo Mode' };
    }

    try {
      const payload = {
        action: action,
        data: data,
        timestamp: new Date().toISOString()
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS || 15000);

      // Gunakan Content-Type text/plain agar browser TIDAK mengirim CORS Preflight (OPTIONS)
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error(`❌ [API Error] Action "${action}" gagal:`, err);
      return {
        success: false,
        message: err.name === 'AbortError' ? 'Koneksi waktu habis (Timeout).' : 'Koneksi backend gagal: ' + err.message
      };
    }
  },

  // ── Public API ──
  async getInitialData() {
    return await this.request('getInitialData');
  },

  async createOrder(orderPayload) {
    return await this.request('createOrder', orderPayload);
  },

  async createReservation(resPayload) {
    return await this.request('createReservation', resPayload);
  },

  // ── Auth & Admin API ──
  async loginUser(username, password) {
    return await this.request('loginUser', { username, password });
  },

  async getAdminDashboardData() {
    return await this.request('getAdminDashboardData');
  },

  async saveMenuItem(menuData) {
    return await this.request('saveMenuItem', menuData);
  },

  async toggleMenuStock(menuId, stock) {
    return await this.request('toggleMenuStock', { menuId, stock });
  },

  async deleteMenuItem(menuId) {
    return await this.request('deleteMenuItem', { menuId });
  },

  async updateOrderStatus(orderId, status) {
    return await this.request('updateOrderStatus', { orderId, status });
  },

  async updateReservationStatus(resId, status) {
    return await this.request('updateReservationStatus', { resId, status });
  },

  async toggleStoreStatus(status) {
    return await this.request('toggleStoreStatus', { status });
  },

  async toggleTableStatus(status) {
    return await this.request('toggleTableStatus', { status });
  },

  async getReceiptHtml(orderId) {
    return await this.request('getReceiptHtml', { orderId });
  }
};
