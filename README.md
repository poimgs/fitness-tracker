# Fitness Tracker Application

A modern fitness tracking application built with React and Supabase.

## Features

- Track workout plans and exercises
- Monitor body statistics over time
- Visualize progress with charts
- User authentication via Supabase
- Real-time data updates

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Data Visualization**: Chart.js, React-Chartjs-2

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:

#### workout_plans Table
```sql
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  focus TEXT NOT NULL,
  exercises JSONB NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can only access their own workout plans" 
  ON workout_plans 
  FOR ALL 
  USING (auth.uid() = user_id);
```

#### body_stats Table
```sql
CREATE TABLE body_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  body_fat_percentage NUMERIC(5,2),
  muscle_percentage NUMERIC(5,2),
  bone_weight NUMERIC(5,2),
  bmi NUMERIC(5,2),
  water_percentage NUMERIC(5,2),
  metabolism_rate NUMERIC(5,2),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE body_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can only access their own body stats" 
  ON body_stats 
  FOR ALL 
  USING (auth.uid() = user_id);
```

3. Get your Supabase URL and anon key from the project settings

4. Create user accounts in Supabase:
   - Go to Authentication > Users in your Supabase dashboard
   - Click "Add User" and create users manually
   - The application does not have a sign-up flow, so all users must be created by an administrator

### Application Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/fitness-tracker.git
   cd fitness-tracker
   ```

2. Install dependencies
   ```
   npm run install:client
   ```

3. Create a `.env` file in the client directory with your Supabase credentials
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server
   ```
   npm start
   ```

## Deployment

1. Build the application
   ```
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider of choice (Vercel, Netlify, etc.)

## License

This project is licensed under the ISC License.
