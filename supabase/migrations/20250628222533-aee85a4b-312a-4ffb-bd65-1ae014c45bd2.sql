
-- Add duration_ms field to tool_executions table to track execution times
ALTER TABLE public.tool_executions 
ADD COLUMN duration_ms INTEGER;

-- Add an index on tool_id and user_id for efficient historical data queries
CREATE INDEX idx_tool_executions_tool_user ON public.tool_executions(tool_id, user_id);
