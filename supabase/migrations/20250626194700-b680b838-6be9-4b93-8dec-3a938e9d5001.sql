
-- Add tags column to the existing contacts table
ALTER TABLE public.contacts 
ADD COLUMN tags TEXT[];

-- Create user_tags table to store master list of tags for each user
CREATE TABLE public.user_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_tag UNIQUE (user_id, tag_name)
);

-- Add Row Level Security (RLS) to user_tags table
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for user_tags table
CREATE POLICY "Users can view their own tags" 
  ON public.user_tags 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
  ON public.user_tags 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
  ON public.user_tags 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
  ON public.user_tags 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance on user queries
CREATE INDEX idx_user_tags_user_id ON public.user_tags(user_id);
CREATE INDEX idx_user_tags_tag_name ON public.user_tags(tag_name);
