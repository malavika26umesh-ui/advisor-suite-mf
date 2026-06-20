import React, { useState, useEffect } from 'react';
import { mcpService } from '../services/mcp.service';
import type { MCPActionLogItem } from '../services/mcp.service';
import { Button, Card, Badge, Modal, useToast } from '../components/ui';
import { CheckCircle, Clock, Check, X, CaretDown, CaretUp } from '@phosphor-icons/react';

export const AdvisorApprovalCentre: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [pendingActions, setPendingActions] = useState<MCPActionLogItem[]>([]);
    const [historyActions, setHistoryActions] = useState<MCPActionLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
    const { addToast } = useToast();

    const fetchPending = async () => {
        try {
            const data = await mcpService.getPendingActions();
            setPendingActions(data);
        } catch (err) {
            console.error("Failed to fetch pending actions", err);
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await mcpService.getHistory();
            setHistoryActions(data);
        } catch (err) {
            console.error("Failed to fetch history actions", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPending().finally(() => setLoading(false));
            const interval = setInterval(fetchPending, 30000);
            return () => clearInterval(interval);
        } else {
            fetchHistory().finally(() => setLoading(false));
        }
    }, [activeTab]);

    const toggleExpand = (id: number) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleApprove = async (id: number) => {
        try {
            await mcpService.approveAction(id);
            addToast('Action approved successfully', 'success');
            setPendingActions(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            addToast('Failed to approve action', 'error');
        }
    };

    const handleReject = async () => {
        if (selectedActionId === null) return;
        try {
            await mcpService.rejectAction(selectedActionId);
            addToast('Action rejected', 'info');
            setPendingActions(prev => prev.filter(a => a.id !== selectedActionId));
        } catch (err) {
            addToast('Failed to reject action', 'error');
        } finally {
            setRejectModalOpen(false);
            setSelectedActionId(null);
        }
    };

    const getToolColor = (toolName: string) => {
        switch (toolName) {
            case 'doc_append': return 'bg-brand-teal text-white';
            case 'calendar_hold_creator': return 'bg-brand-navy text-white';
            case 'email_draft_generator': return 'bg-brand-saffron text-white';
            default: return 'bg-neutral-500 text-white';
        }
    };

    const getToolDisplayName = (toolName: string) => {
        switch (toolName) {
            case 'doc_append': return 'Doc Append';
            case 'calendar_hold_creator': return 'Calendar Hold';
            case 'email_draft_generator': return 'Email Draft';
            default: return toolName;
        }
    };

    const getActionSummary = (toolName: string) => {
        switch (toolName) {
            case 'doc_append': return 'Appends market context and fee details to the shared logging system.';
            case 'calendar_hold_creator': return 'Creates a calendar hold block for the advisor call.';
            case 'email_draft_generator': return 'Generates a pre-meeting brief email draft ready for your review.';
            default: return 'Executes system action.';
        }
    };

    const renderActionCard = (action: MCPActionLogItem, isHistory = false) => {
        const isExpanded = expandedCards[action.id];
        const minutesAgo = Math.floor((new Date().getTime() - new Date(action.triggered_at).getTime()) / 60000);

        return (
            <Card key={action.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getToolColor(action.tool_name)}`}>
                            {getToolDisplayName(action.tool_name)}
                        </span>
                        {isHistory ? (
                            <Badge status={action.status === 'approved' ? 'confirmed' : 'cancelled'} />
                        ) : (
                            <Badge status="pending" />
                        )}
                        <span className="text-neutral-500 text-xs flex items-center gap-1">
                            <Clock size={14} /> {minutesAgo} min ago
                        </span>
                    </div>
                    {action.booking_code ? (
                        <span className="font-mono text-sm text-brand-navy font-bold">{action.booking_code}</span>
                    ) : (
                        <span className="text-sm font-semibold text-neutral-600">Pulse Report</span>
                    )}
                </div>

                <p className="text-neutral-700 text-sm mb-4">{getActionSummary(action.tool_name)}</p>

                <button 
                    onClick={() => toggleExpand(action.id)}
                    className="flex items-center gap-1 text-sm text-brand-teal font-medium mb-4 hover:underline"
                >
                    View Details {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                </button>

                {isExpanded && (
                    <div className="bg-neutral-50 p-4 rounded-md mb-4 text-sm font-mono overflow-x-auto">
                        <h4 className="font-bold text-neutral-700 mb-2 border-b pb-1">Inputs</h4>
                        {Object.entries(action.inputs).map(([key, value]) => (
                            <div key={key} className="mb-1">
                                <span className="text-neutral-500">{key}: </span>
                                <span className="text-neutral-900">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                            </div>
                        ))}
                        {isHistory && action.output && (
                            <div className="mt-4">
                                <h4 className="font-bold text-neutral-700 mb-2 border-b pb-1">Output</h4>
                                {Object.entries(action.output).map(([key, value]) => (
                                    <div key={key} className="mb-1">
                                        <span className="text-neutral-500">{key}: </span>
                                        <span className="text-neutral-900">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {!isHistory && (
                    <div className="flex gap-3 justify-end border-t pt-4 mt-2">
                        <Button 
                            variant="secondary" 
                            onClick={() => {
                                setSelectedActionId(action.id);
                                setRejectModalOpen(true);
                            }}
                        >
                            <X size={18} className="mr-1 inline" /> Reject
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => handleApprove(action.id)}
                        >
                            <Check size={18} className="mr-1 inline" /> Approve
                        </Button>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-navy mb-6">Approval Centre</h1>

            <div className="flex gap-4 border-b border-neutral-200 mb-6">
                <button
                    className={`pb-2 px-1 text-sm font-medium ${activeTab === 'pending' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-neutral-500 hover:text-neutral-700'}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Actions ({pendingActions.length})
                </button>
                <button
                    className={`pb-2 px-1 text-sm font-medium ${activeTab === 'history' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-neutral-500 hover:text-neutral-700'}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            {loading ? (
                <div className="py-10 text-center text-neutral-500">Loading...</div>
            ) : (
                <div>
                    {activeTab === 'pending' && (
                        pendingActions.length > 0 ? (
                            pendingActions.map(a => renderActionCard(a))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                                <CheckCircle size={48} className="mb-3 text-neutral-300" />
                                <p>No pending actions. All MCP actions have been reviewed.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'history' && (
                        historyActions.length > 0 ? (
                            historyActions.map(a => renderActionCard(a, true))
                        ) : (
                            <div className="py-12 text-center text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                                <p>No past actions yet.</p>
                            </div>
                        )
                    )}
                </div>
            )}

            {rejectModalOpen && (
                <Modal isOpen={true} onClose={() => setRejectModalOpen(false)}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Are you sure?</h3>
                        <p className="text-neutral-600 mb-6">This MCP action will not execute.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleReject}>Confirm Reject</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdvisorApprovalCentre;
