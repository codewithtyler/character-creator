-- Create settings table for feature flags
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on feature_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_feature_name ON settings(feature_name);

-- Insert initial feature flags
INSERT INTO settings (feature_name, description, enabled) VALUES
  ('character_creator', 'Character creation with LoRA', true),
  ('text_to_image', 'Text-to-image generation', false),
  ('scheduling', 'Blotato scheduling integration', false),
  ('image_editing', 'Image-to-image editing', false),
  ('video_generation', 'Video generation with SkyReels', false),
  ('analytics', 'Advanced analytics dashboard', false)
ON CONFLICT (feature_name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

