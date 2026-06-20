# Mutual Fund Advisor Suite - Test Cases

## Sprint 21: MCP Orchestration & Approval Centre

| ID       | Test Case Description                                                                         | Status |
|----------|-----------------------------------------------------------------------------------------------|--------|
| TC-21.1  | `MCPActionLog` schema and model exist and can handle queued actions.                           | PASSED |
| TC-21.2  | `DocAppendTool` successfully appends to `mcp_shared_log.json` upon approval.                   | PASSED |
| TC-21.3  | `CalendarHoldCreatorTool` correctly generates mock calendar event details.                    | PASSED |
| TC-21.4  | `EmailDraftGeneratorTool` formats the correct pre-meeting brief draft.                        | PASSED |
| TC-21.5  | P0: No auto-send on email draft (Only queued as pending initially, executed on approval).      | PASSED |
| TC-21.6  | P0: No PII in any MCP input. `PIIGuard` blocks PII successfully.                               | PASSED |
| TC-21.7  | Advisor Approval Centre correctly fetches pending actions and history.                         | PASSED |
| TC-21.8  | Approving a pending action updates status to `approved` and generates `output_json`.           | PASSED |
| TC-21.9  | Rejecting a pending action updates status to `rejected` without executing tool logic.          | PASSED |
| TC-21.10 | Trigger points correctly queue actions during booking, pulse, and brief generation.            | PASSED |
