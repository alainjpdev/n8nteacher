/*
  # Create initial schema for real estate application

  1. New Tables
    - `properties` - Stores all property listings
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `address` (text, required)
      - `price` (numeric, required)
      - `description` (text)
      - `type` (text, "sale" or "rent")
      - `bedrooms` (integer)
      - `bathrooms` (numeric)
      - `square_feet` (integer)
      - `year_built` (integer)
      - `features` (jsonb)
      - `status` (text)
      - `lat` (numeric)
      - `lng` (numeric)
      - `images` (jsonb)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `user_id` (uuid, references auth.users)
    
    - `favorites` - Stores user's favorite properties
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `property_id` (uuid, references properties)
      - `created_at` (timestamptz, default now())
    
    - `inquiries` - Stores user inquiries about properties
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `property_id` (uuid, references properties)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamptz, default now())
      - `read` (boolean, default false)
      - `responded` (boolean, default false)
  
  2. Security
    - Enable RLS on all tables
    - Add policies to control access to properties, favorites, and inquiries
*/

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  address text NOT NULL,
  price numeric NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('sale', 'rent')),
  bedrooms integer,
  bathrooms numeric,
  sqft integer,
  year_built integer,
  features jsonb,
  status text DEFAULT 'active',
  lat numeric,
  lng numeric,
  images jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  property_id uuid REFERENCES properties(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  property_id uuid REFERENCES properties(id) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  responded boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Property Policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own properties"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Inquiries Policies
CREATE POLICY "Users can see inquiries about their properties"
  ON inquiries
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM properties 
      WHERE properties.id = property_id
    )
    OR
    auth.uid() = user_id
  );

CREATE POLICY "Anyone can create inquiries"
  ON inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Property owners can update inquiries"
  ON inquiries
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM properties 
      WHERE properties.id = property_id
    )
  );