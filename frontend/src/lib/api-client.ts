/**
 * Centralized API Client for First Contact E.I.S.
 *
 * Eliminates redundancy by centralizing all API calls in one place.
 * Handles authentication, error handling, and request formatting automatically.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
    constructor(
        public status: number,
        public userMessage: string,
        public details?: any
    ) {
        super(userMessage);
        this.name = 'ApiError';
    }
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
            throw new ApiError(
                response.status,
                error.detail || error.message || 'Request failed',
                error
            );
        }
        return response.json();
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });
        return this.handleResponse<T>(response);
    }

    async patch<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse<T>(response);
    }
}

// Singleton instance
const apiClient = new ApiClient();

// Organized API endpoints
export const api = {
    // Authentication
    auth: {
        login: (email: string, password: string, org_slug: string) =>
            apiClient.post('/api/v1/auth/login', { email, password, org_slug }),
        register: (data: any) =>
            apiClient.post('/api/v1/auth/register', data)
    },

    // Clients
    clients: {
        list: (params?: any) =>
            apiClient.get('/api/v1/clients' + (params ? `?${new URLSearchParams(params)}` : '')),
        get: (id: string) =>
            apiClient.get(`/api/v1/clients/${id}`),
        update: (id: string, data: any) =>
            apiClient.patch(`/api/v1/clients/${id}`, data),
        timeline: (id: string) =>
            apiClient.get(`/api/v1/clients/${id}/timeline`),
        generateCasePlan: (id: string) =>
            apiClient.post(`/api/v1/clients/${id}/case-plan/generate`)
    },

    // Benefits
    benefits: {
        getProjection: (clientId: string) =>
            apiClient.get(`/api/v1/clients/${clientId}/benefits/projection`),
        apply: (clientId: string, benefitCode: string) =>
            apiClient.post(`/api/v1/clients/${clientId}/benefits/apply`, { benefit_code: benefitCode, status: 'applied' }),
        list: (clientId: string) =>
            apiClient.get(`/api/v1/clients/${clientId}/benefits`)
    },

    // Layer 8 Analytics (City Admin Only)
    analytics: {
        vendorPerformance: () =>
            apiClient.get('/api/v1/analytics/vendor-performance'),
        geographic: () =>
            apiClient.get('/api/v1/analytics/geographic'),
        bottlenecks: () =>
            apiClient.get('/api/v1/analytics/bottlenecks')
    },

    // Maps (City Admin Only)
    maps: {
        vendorTerritories: () =>
            apiClient.get('/api/v1/maps/vendor-territories'),
        qrLocations: () =>
            apiClient.get('/api/v1/maps/qr-locations'),
        clientDensity: () =>
            apiClient.get('/api/v1/maps/client-density')
    },

    // AI Strategic Advisor (City Admin Only)
    aiAdvisor: {
        ask: (question: string) =>
            apiClient.post('/api/v1/ai-advisor/ask', { question, include_context: true }),
        suggestedQuestions: () =>
            apiClient.get('/api/v1/ai-advisor/suggested-questions'),
        contextSummary: () =>
            apiClient.get('/api/v1/ai-advisor/context-summary')
    },

    // Orchestrator
    orchestrator: {
        getRecommendations: () =>
            apiClient.get('/api/v1/orchestrator/recommendations'),
        approve: (id: string) =>
            apiClient.post(`/api/v1/orchestrator/recommendations/${id}/approve`),
        reject: (id: string, reason: string) =>
            apiClient.post(`/api/v1/orchestrator/recommendations/${id}/reject`, { reason }),
        seedPilot: () =>
            apiClient.post('/api/v1/orchestrator/seed-pilot')
    },

    // Public Intake
    intake: {
        qr: (qrLocationId: string, data: any) =>
            apiClient.post(`/api/v1/intake/qr/${qrLocationId}`, data)
    }
};

// Export types
export { ApiError };
export default api;
