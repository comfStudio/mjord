CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles for SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles for INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles for UPDATE
  USING ( auth.uid() = id );