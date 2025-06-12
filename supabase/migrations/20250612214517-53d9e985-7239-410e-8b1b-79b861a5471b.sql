
-- Add columns to tools table to support dynamic configurations
ALTER TABLE public.tools 
ADD COLUMN input_schema JSONB,
ADD COLUMN output_schema JSONB,
ADD COLUMN execution_type TEXT DEFAULT 'api',
ADD COLUMN api_endpoint TEXT;

-- Update existing tools with sample configurations
UPDATE public.tools 
SET input_schema = jsonb_build_object(
  'fields', jsonb_build_array(
    jsonb_build_object(
      'name', 'input_text',
      'type', 'text',
      'label', 'Input Text',
      'placeholder', 'Enter your text here...',
      'required', true
    )
  )
),
output_schema = jsonb_build_object(
  'type', 'text',
  'label', 'Generated Output'
)
WHERE input_schema IS NULL;

-- Create a table to store tool execution results for history
CREATE TABLE public.tool_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  tool_id UUID REFERENCES public.tools(id) NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB,
  status TEXT DEFAULT 'pending',
  credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for tool_executions
ALTER TABLE public.tool_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own executions" 
  ON public.tool_executions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own executions" 
  ON public.tool_executions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own executions" 
  ON public.tool_executions 
  FOR UPDATE 
  USING (auth.uid() = user_id);
