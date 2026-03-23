import { create } from 'zustand';
import { api } from '../services/api';

const severityLabelMap = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

const severityConfidenceMap = {
  LOW: 76,
  MEDIUM: 84,
  HIGH: 95,
};

const emotionEmojiMap = {
  Calm: '🙂',
  Neutral: '😐',
  Frustrated: '😠',
  Angry: '😡',
};

const defaultUser = {
  name: 'Guest Customer',
  company: 'Web Support Queue',
  plan: 'Support',
  lifetimeValue: 'N/A',
  avatar: 'GC',
};

const mapTicketToViewModel = (ticket) => {
  const severity = severityLabelMap[ticket.severity] || ticket.severity || 'Medium';
  const emotionLabel = ticket.emotion || 'Neutral';

  return {
    id: ticket.id,
    category: ticket.category || 'General',
    severity,
    status: ticket.status || 'Open',
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: ticket.updatedAt,
    summary: ticket.aiSummary || ticket.message || 'No summary available.',
    confidence: severityConfidenceMap[ticket.severity] || 82,
    reasoning: [
      `Severity: ${severity}`,
      `Category: ${ticket.category || 'General'}`,
      `Status: ${ticket.status || 'Open'}`,
    ],
    emotion: {
      emoji: emotionEmojiMap[emotionLabel] || '😐',
      label: emotionLabel,
    },
    messages: ticket.message
      ? [{ id: 1, sender: 'user', text: ticket.message }]
      : [],
    copilot: ticket.copilot || null,
    user: defaultUser,
  };
};

const mapAnalyzeResponseToTicket = (response) => {
  const mappedTicket = mapTicketToViewModel({
    ...response.ticket,
    copilot: response.copilot,
  });

  return {
    ...mappedTicket,
    summary: response.copilot?.summary || mappedTicket.summary,
    reasoning: [
      `Severity: ${mappedTicket.severity}`,
      `Category: ${mappedTicket.category}`,
      `Action: ${response.copilot?.suggestedAction || 'Manual review'}`,
    ],
  };
};

const computeStats = (tickets, apiStats) => ({
  total: apiStats?.total ?? tickets.length,
  high: apiStats?.highPriority ?? tickets.filter((ticket) => ticket.severity === 'High' && ticket.status !== 'Resolved').length,
  resolved: apiStats?.resolved ?? tickets.filter((ticket) => ticket.status === 'Resolved').length,
  avgResolution: apiStats?.avgResolution ?? 14,
  csat: apiStats?.csat ?? '98.2%',
});

export const useTicketStore = create((set, get) => ({
  analysisKeywords: ['refund', 'human', 'broken', 'error', 'cancel', 'urgent', 'bug', 'manager', 'issue', 'premium'],
  tickets: [],
  stats: { total: 0, high: 0, resolved: 0, avgResolution: 14, csat: '98.2%' },
  isLoading: false,
  isSubmitting: false,
  isResolving: false,
  hasFetchedTickets: false,
  isApiHealthy: true,
  error: null,

  addKeyword: (keyword) =>
    set((state) => ({
      analysisKeywords: [...new Set([...state.analysisKeywords, keyword.toLowerCase()])],
    })),

  removeKeyword: (keyword) =>
    set((state) => ({
      analysisKeywords: state.analysisKeywords.filter((entry) => entry !== keyword),
    })),

  clearError: () => set({ error: null }),

  initializeTickets: async ({ force = false } = {}) => {
    if (get().hasFetchedTickets && !force) {
      return;
    }

    await Promise.all([get().fetchTickets(), get().checkHealth()]);
  },

  checkHealth: async () => {
    try {
      const data = await api.getHealth();
      set({ isApiHealthy: data.status === 'ok' });
    } catch {
      set({ isApiHealthy: false });
    }
  },

  fetchTickets: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await api.getTickets();
      const tickets = (data.tickets || []).map(mapTicketToViewModel);

      set({
        tickets,
        stats: computeStats(tickets, data.stats),
        hasFetchedTickets: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  createTicketFromMessage: async (message) => {
    set({ isSubmitting: true, error: null });

    try {
      const data = await api.analyzeMessage(message);

      if (data.deflected) {
        set({ isSubmitting: false });
        return {
          type: 'deflected',
          response: data,
        };
      }

      const ticket = mapAnalyzeResponseToTicket(data);
      const nextTickets = [ticket, ...get().tickets.filter((entry) => entry.id !== ticket.id)];

      set({
        tickets: nextTickets,
        stats: computeStats(nextTickets),
        isSubmitting: false,
      });

      return {
        type: 'ticket',
        ticket,
        response: data,
      };
    } catch (error) {
      set({
        error: error.message,
        isSubmitting: false,
      });

      throw error;
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      const data = await api.updateTicket(id, { status });

      set((state) => {
        const tickets = state.tickets.map((ticket) =>
          ticket.id === id
            ? {
                ...ticket,
                status: data.ticket.status,
                updatedAt: data.ticket.updatedAt,
              }
            : ticket
        );

        return {
          tickets,
          stats: computeStats(tickets, data.stats),
        };
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  resolveTicket: async (id) => {
    set({ isResolving: true });
    try {
      const data = await api.resolveTicket(id);

      set((state) => {
        const tickets = state.tickets.map((ticket) =>
          ticket.id === id
            ? {
                ...ticket,
                status: data.ticket.status,
                updatedAt: data.ticket.updatedAt,
              }
            : ticket
        );

        return {
          tickets,
          stats: computeStats(tickets, data.stats),
          isResolving: false,
        };
      });
    } catch (error) {
      set({ error: error.message, isResolving: false });
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      const data = await api.deleteTicket(id);

      set((state) => {
        const tickets = state.tickets.filter((ticket) => ticket.id !== id);

        return {
          tickets,
          stats: computeStats(tickets, data.stats),
        };
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  getStats: () => get().stats,

  enableSync: (intervalMs = 30000) => {
    const timer = setInterval(() => {
      get().fetchTickets();
      get().checkHealth();
    }, intervalMs);

    return () => clearInterval(timer);
  },
}));
