DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed user (idempotent: skip if email already exists)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kimberly@adapta.org') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'kimberly@adapta.org',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Kimberly"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $$;

-- Fix RLS for Document table
DROP POLICY IF EXISTS "authenticated_select_document" ON public.document;
CREATE POLICY "authenticated_select_document" ON public.document FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_document" ON public.document;
CREATE POLICY "authenticated_insert_document" ON public.document FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_document" ON public.document;
CREATE POLICY "authenticated_update_document" ON public.document FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_document" ON public.document;
CREATE POLICY "authenticated_delete_document" ON public.document FOR DELETE TO authenticated USING (true);

-- Fix RLS for Document Section table
DROP POLICY IF EXISTS "authenticated_select_document_section" ON public.document_section;
CREATE POLICY "authenticated_select_document_section" ON public.document_section FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_document_section" ON public.document_section;
CREATE POLICY "authenticated_insert_document_section" ON public.document_section FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_document_section" ON public.document_section;
CREATE POLICY "authenticated_update_document_section" ON public.document_section FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_document_section" ON public.document_section;
CREATE POLICY "authenticated_delete_document_section" ON public.document_section FOR DELETE TO authenticated USING (true);
