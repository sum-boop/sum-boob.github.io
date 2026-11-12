/*
# Create contact_messages table

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key, generated automatically)
  - `name` (text, required, 2 to 120 characters)
  - `email` (text, required, up to 254 characters)
  - `organization` (text, optional, up to 120 characters)
  - `message` (text, required, 10 to 5000 characters)
  - `created_at` (timestamp, set automatically)

2. Security
- Row Level Security is enabled on `contact_messages`.
- The website (anonymous visitors) may only INSERT new messages. It cannot read, edit or delete anything.
- Messages are read by the site owner from the database dashboard.
- Length limits are enforced by the table itself, so oversized submissions are rejected.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  organization text CHECK (organization IS NULL OR char_length(organization) <= 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);
