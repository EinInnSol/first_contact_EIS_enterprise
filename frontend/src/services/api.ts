import axios from 'axios';

// Backend URL (from Cloud Run)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://first-contact-backend-4fmsifz77q-ul.a.run.app/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const intakeApi = {
    // Public QR Scan
    scanQr: async (qrId: string, data: any) => {
        return api.post(`/intake/qr/${qrId}`, data);
    },
    recordScan: async (qrId: string) => {
        return api.post(`/intake/qr/${qrId}/scan`);
    }
};

export const orchestratorApi = {
    // AI Recommendations
    getRecommendations: async () => {
        return api.get('/orchestrator/recommendations');
    },
    approveRecommendation: async (id: string, notes?: string) => {
        return api.post(`/orchestrator/recommendations/${id}/approve`, { notes });
    }
};

export default api;
