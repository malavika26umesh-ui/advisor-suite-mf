import { api } from './api';

export interface MCPActionLogItem {
    id: number;
    tool_name: string;
    status: string;
    inputs: Record<string, any>;
    output: Record<string, any> | null;
    triggered_at: string;
    resolved_at: string | null;
    resolved_by: string | null;
    booking_code: string | null;
}

export interface ToolSchema {
    name: string;
    description: string;
    input_schema: Record<string, any>;
}

export const mcpService = {
    getPendingActions: async (): Promise<MCPActionLogItem[]> => {
        const response = await api.get('/mcp/pending');
        return response.data;
    },

    getHistory: async (): Promise<MCPActionLogItem[]> => {
        const response = await api.get('/mcp/history');
        return response.data;
    },

    approveAction: async (id: number): Promise<MCPActionLogItem> => {
        const response = await api.post(`/mcp/actions/${id}/approve`);
        return response.data;
    },

    rejectAction: async (id: number): Promise<MCPActionLogItem> => {
        const response = await api.post(`/mcp/actions/${id}/reject`);
        return response.data;
    },

    getToolSchemas: async (): Promise<ToolSchema[]> => {
        const response = await api.get('/mcp/tools');
        return response.data;
    }
};
