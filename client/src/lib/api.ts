/**
 * Alumni Connect - API Client Library
 * Central utility for all backend API calls
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Helper ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Must match the key used by AuthContext.tsx
    return localStorage.getItem('alumni_token');
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
    login: (email: string, password: string, role: string) =>
        request<{ token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        }),

    register: (data: Record<string, any>) =>
        request<{ token: string; user: any }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    me: () => request<any>('/auth/me'),
};

// ─── Users / Directory ────────────────────────────────────────────────────────

export const users = {
    list: (params?: { search?: string; role?: string; industry?: string; batchYear?: string }) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
        );
        const qs = new URLSearchParams(cleanParams as any).toString();
        return request<any[]>(`/users${qs ? `?${qs}` : ''}`);
    },

    getById: (id: string) => request<any>(`/users/${id}`),

    updateProfile: (data: Record<string, any>) =>
        request<any>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    approve: (id: string) =>
        request<any>(`/users/${id}/approve`, { method: 'PUT' }),

    delete: (id: string) =>
        request<any>(`/users/${id}`, { method: 'DELETE' }),

    updateByAdmin: (id: string, data: Record<string, any>) =>
        request<any>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    pending: () => request<any[]>('/users/pending'),
    getStudentStats: () => request<any>('/users/stats'),
    getLeaderboard: () => request<any[]>('/users/leaderboard'),
};

export const admin = {
    getUsers: () => request<any>('/users'),
    getRegistrations: () => request<any>('/users/registrations'),
    approveUser: (id: string) => request<any>(`/users/${id}/approve`, { method: 'PUT' }),
    deleteUser: (id: string) => request<any>(`/users/${id}`, { method: 'DELETE' }),
    getPayouts: () => request<any>('/payouts/admin/all'),
    processPayout: (id: string, status: string) => request<any>(`/payouts/admin/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getInboundPayments: () => request<any[]>('/payouts/admin/inbound'),
    confirmStudentPayment: (id: string) => request<any>(`/payouts/admin/confirm-payment/${id}`, { method: 'PUT' }),
    getFinancials: () => request<any>('/payouts/admin/financials'),
    getConfig: () => request<any>('/payouts/admin/config'),
    updateConfig: (key: string, value: any) => request<any>('/payouts/admin/config', { method: 'PUT', body: JSON.stringify({ key, value }) }),
    getPublicConfig: (key: string) => request<any>(`/payouts/platform/config/${key}`),
    getDashboardAnalytics: () => request<any>('/analytics/dashboard'),
    getRevenueAnalytics: () => request<any>('/analytics/revenue'),
    createDonationCampaign: (data: any) => request<any>('/donations/admin/campaigns', { method: 'POST', body: JSON.stringify(data) }),
};

export const upload = {
    image: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        // Use custom fetch without JSON Content-Type
        const token = getToken();
        return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload/profile-image`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
        }).then(res => res.json());
    }
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const jobs = {
    list: () => request<any[]>('/jobs'),

    create: (data: Record<string, any>) =>
        request<any>('/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    apply: (id: string) =>
        request<any>(`/jobs/${id}/apply`, { method: 'POST' }),
};

export const alumni = {
    getStats: () => request<any>('/alumni/stats'),
    getEarnings: () => request<any>('/payouts/earnings'),
    requestPayout: (data: { amount: number, method?: any }) => request<any>('/payouts/request', { method: 'POST', body: JSON.stringify(data) }),
    updatePaymentSettings: (data: any) => request<any>('/payouts/settings', { method: 'PUT', body: JSON.stringify(data) }),
    getDonationCampaigns: () => request<any>('/donations/campaigns'),
    recordDonation: (data: { type: string, campaignId?: string, amount: number, transactionId: string }) => request<any>('/donations/donate', { method: 'POST', body: JSON.stringify(data) }),
    getMyDonations: () => request<any>('/donations/my-history'),
    getLegacyStats: () => request<any>('/alumni/legacy'),
    updateMentoringSettings: (data: any) => request<any>('/alumni/setup', { method: 'PUT', body: JSON.stringify(data) }),
    getAvailableSessionRequests: () => request<any[]>('/alumni/requests/available'),
    acceptSessionRequest: (requestId: string, scheduledDate?: string) =>
        request<any>('/alumni/requests/accept', {
            method: 'POST',
            body: JSON.stringify({ requestId, scheduledDate }),
        }),
};

export const faculty = {
    getStats: () => request<any>('/faculty/stats'),
    fetchSessionRequests: () => request<any[]>('/faculty/requests'),
    createSessionRequest: (topic: string, description: string) =>
        request<any>('/faculty/requests', {
            method: 'POST',
            body: JSON.stringify({ topic, description }),
        }),
};

// ─── Events ───────────────────────────────────────────────────────────────────

export const events = {
    list: () => request<any[]>('/events'),

    create: (data: Record<string, any>) =>
        request<any>('/events', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    register: (id: string) =>
        request<any>(`/events/${id}/register`, { method: 'POST' }),

    // Sessions helper (subset of events)
    listSessions: () => request<any[]>('/events?type=session'),

    createSession: (data: Record<string, any>) =>
        request<any>('/events', {
            method: 'POST',
            body: JSON.stringify({ ...data, type: 'session' }),
        }),

    requestSession: (data: Record<string, any>) =>
        request<any>('/events/request', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    acceptSession: (id: string) =>
        request<any>(`/events/${id}/accept`, { method: 'PUT' }),

    rejectSession: (id: string) =>
        request<any>(`/events/${id}/reject`, { method: 'PUT' }),

    attend: (id: string) =>
        request<any>(`/events/${id}/attend`, { method: 'POST' }),

    rate: (id: string, score: number, feedback: string) =>
        request<any>(`/events/${id}/rate`, {
            method: 'POST',
            body: JSON.stringify({ score, feedback }),
        }),
};

// ─── Posts / Feed ─────────────────────────────────────────────────────────────

export const posts = {
    list: () => request<any[]>('/posts'),

    create: (content: string) =>
        request<any>('/posts', {
            method: 'POST',
            body: JSON.stringify({ content }),
        }),

    like: (id: string) =>
        request<any>(`/posts/${id}/like`, { method: 'POST' }),

    comment: (id: string, text: string) =>
        request<any>(`/posts/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        }),
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = {
    getConversation: (userId: string) => request<any[]>(`/messages/${userId}`),

    send: (recipientId: string, content: string) =>
        request<any>('/messages', {
            method: 'POST',
            body: JSON.stringify({ recipient: recipientId, content }),
        }),
};

// ─── Resume Review ────────────────────────────────────────────────────────────

export const resumes = {
    request: (data: { alumniId: string; resumeUrl: string; resumeName: string }) =>
        request<any>('/resumes/request', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    listForAlumni: () => request<any[]>('/resumes/alumni'),

    listForStudent: () => request<any[]>('/resumes/student'),

    submitFeedback: (id: string, feedback: string) =>
        request<any>(`/resumes/${id}/feedback`, {
            method: 'PUT',
            body: JSON.stringify({ feedback }),
        }),
};

// ─── Announcements ────────────────────────────────────────────────────────────
export const announcements = {
    list: () => request<any[]>('/announcements'),
    create: (data: any) => request<any>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/announcements/${id}`, { method: 'DELETE' }),
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────
export const quizzes = {
    getAnalytics: () => request<any[]>('/quizzes/analytics'),
    getLeaderboard: () => request<any[]>('/quizzes/leaderboard'),
    getGaps: () => request<any[]>('/quizzes/gaps'),
    generate: (data: any) => request<any>('/quizzes/generate', { method: 'POST', body: JSON.stringify(data) }),
    submit: (data: any) => request<any>('/quizzes/submit', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const health = {
    check: () =>
        fetch(`${BASE_URL.replace('/api', '')}/health`).then(r => r.json()),
};
