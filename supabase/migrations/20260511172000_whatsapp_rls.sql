-- evolution_instances
DROP POLICY IF EXISTS "authenticated_select_evolution_instances" ON public.evolution_instances;
CREATE POLICY "authenticated_select_evolution_instances" ON public.evolution_instances FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_evolution_instances" ON public.evolution_instances;
CREATE POLICY "authenticated_insert_evolution_instances" ON public.evolution_instances FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_evolution_instances" ON public.evolution_instances;
CREATE POLICY "authenticated_update_evolution_instances" ON public.evolution_instances FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_evolution_instances" ON public.evolution_instances;
CREATE POLICY "authenticated_delete_evolution_instances" ON public.evolution_instances FOR DELETE TO authenticated USING (true);

-- whatsapp_contacts
DROP POLICY IF EXISTS "authenticated_select_whatsapp_contacts" ON public.whatsapp_contacts;
CREATE POLICY "authenticated_select_whatsapp_contacts" ON public.whatsapp_contacts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_contacts" ON public.whatsapp_contacts;
CREATE POLICY "authenticated_insert_whatsapp_contacts" ON public.whatsapp_contacts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_contacts" ON public.whatsapp_contacts;
CREATE POLICY "authenticated_update_whatsapp_contacts" ON public.whatsapp_contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_contacts" ON public.whatsapp_contacts;
CREATE POLICY "authenticated_delete_whatsapp_contacts" ON public.whatsapp_contacts FOR DELETE TO authenticated USING (true);

-- whatsapp_messages
DROP POLICY IF EXISTS "authenticated_select_whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "authenticated_select_whatsapp_messages" ON public.whatsapp_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "authenticated_insert_whatsapp_messages" ON public.whatsapp_messages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "authenticated_update_whatsapp_messages" ON public.whatsapp_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "authenticated_delete_whatsapp_messages" ON public.whatsapp_messages FOR DELETE TO authenticated USING (true);

-- whatsapp_conversation_status
DROP POLICY IF EXISTS "authenticated_select_whatsapp_conversation_status" ON public.whatsapp_conversation_status;
CREATE POLICY "authenticated_select_whatsapp_conversation_status" ON public.whatsapp_conversation_status FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_conversation_status" ON public.whatsapp_conversation_status;
CREATE POLICY "authenticated_insert_whatsapp_conversation_status" ON public.whatsapp_conversation_status FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_conversation_status" ON public.whatsapp_conversation_status;
CREATE POLICY "authenticated_update_whatsapp_conversation_status" ON public.whatsapp_conversation_status FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_conversation_status" ON public.whatsapp_conversation_status;
CREATE POLICY "authenticated_delete_whatsapp_conversation_status" ON public.whatsapp_conversation_status FOR DELETE TO authenticated USING (true);

-- whatsapp_outbound_queue
DROP POLICY IF EXISTS "authenticated_select_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue;
CREATE POLICY "authenticated_select_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue;
CREATE POLICY "authenticated_insert_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue;
CREATE POLICY "authenticated_update_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue;
CREATE POLICY "authenticated_delete_whatsapp_outbound_queue" ON public.whatsapp_outbound_queue FOR DELETE TO authenticated USING (true);

-- whatsapp_suggestions
DROP POLICY IF EXISTS "authenticated_select_whatsapp_suggestions" ON public.whatsapp_suggestions;
CREATE POLICY "authenticated_select_whatsapp_suggestions" ON public.whatsapp_suggestions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_suggestions" ON public.whatsapp_suggestions;
CREATE POLICY "authenticated_insert_whatsapp_suggestions" ON public.whatsapp_suggestions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_suggestions" ON public.whatsapp_suggestions;
CREATE POLICY "authenticated_update_whatsapp_suggestions" ON public.whatsapp_suggestions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_suggestions" ON public.whatsapp_suggestions;
CREATE POLICY "authenticated_delete_whatsapp_suggestions" ON public.whatsapp_suggestions FOR DELETE TO authenticated USING (true);

-- whatsapp_response_metrics
DROP POLICY IF EXISTS "authenticated_select_whatsapp_response_metrics" ON public.whatsapp_response_metrics;
CREATE POLICY "authenticated_select_whatsapp_response_metrics" ON public.whatsapp_response_metrics FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_response_metrics" ON public.whatsapp_response_metrics;
CREATE POLICY "authenticated_insert_whatsapp_response_metrics" ON public.whatsapp_response_metrics FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_response_metrics" ON public.whatsapp_response_metrics;
CREATE POLICY "authenticated_update_whatsapp_response_metrics" ON public.whatsapp_response_metrics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_response_metrics" ON public.whatsapp_response_metrics;
CREATE POLICY "authenticated_delete_whatsapp_response_metrics" ON public.whatsapp_response_metrics FOR DELETE TO authenticated USING (true);

-- whatsapp_sync_state
DROP POLICY IF EXISTS "authenticated_select_whatsapp_sync_state" ON public.whatsapp_sync_state;
CREATE POLICY "authenticated_select_whatsapp_sync_state" ON public.whatsapp_sync_state FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_sync_state" ON public.whatsapp_sync_state;
CREATE POLICY "authenticated_insert_whatsapp_sync_state" ON public.whatsapp_sync_state FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_sync_state" ON public.whatsapp_sync_state;
CREATE POLICY "authenticated_update_whatsapp_sync_state" ON public.whatsapp_sync_state FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_sync_state" ON public.whatsapp_sync_state;
CREATE POLICY "authenticated_delete_whatsapp_sync_state" ON public.whatsapp_sync_state FOR DELETE TO authenticated USING (true);

-- whatsapp_templates_semanticos
DROP POLICY IF EXISTS "authenticated_select_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos;
CREATE POLICY "authenticated_select_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos;
CREATE POLICY "authenticated_insert_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos;
CREATE POLICY "authenticated_update_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos;
CREATE POLICY "authenticated_delete_whatsapp_templates_semanticos" ON public.whatsapp_templates_semanticos FOR DELETE TO authenticated USING (true);

-- tone_of_voice
DROP POLICY IF EXISTS "authenticated_select_tone_of_voice" ON public.tone_of_voice;
CREATE POLICY "authenticated_select_tone_of_voice" ON public.tone_of_voice FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_tone_of_voice" ON public.tone_of_voice;
CREATE POLICY "authenticated_insert_tone_of_voice" ON public.tone_of_voice FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_tone_of_voice" ON public.tone_of_voice;
CREATE POLICY "authenticated_update_tone_of_voice" ON public.tone_of_voice FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_tone_of_voice" ON public.tone_of_voice;
CREATE POLICY "authenticated_delete_tone_of_voice" ON public.tone_of_voice FOR DELETE TO authenticated USING (true);

-- holidays
DROP POLICY IF EXISTS "authenticated_select_holidays" ON public.holidays;
CREATE POLICY "authenticated_select_holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_holidays" ON public.holidays;
CREATE POLICY "authenticated_insert_holidays" ON public.holidays FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_holidays" ON public.holidays;
CREATE POLICY "authenticated_update_holidays" ON public.holidays FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_holidays" ON public.holidays;
CREATE POLICY "authenticated_delete_holidays" ON public.holidays FOR DELETE TO authenticated USING (true);

-- evolution_webhook_log
DROP POLICY IF EXISTS "authenticated_select_evolution_webhook_log" ON public.evolution_webhook_log;
CREATE POLICY "authenticated_select_evolution_webhook_log" ON public.evolution_webhook_log FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_insert_evolution_webhook_log" ON public.evolution_webhook_log;
CREATE POLICY "authenticated_insert_evolution_webhook_log" ON public.evolution_webhook_log FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_update_evolution_webhook_log" ON public.evolution_webhook_log;
CREATE POLICY "authenticated_update_evolution_webhook_log" ON public.evolution_webhook_log FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_delete_evolution_webhook_log" ON public.evolution_webhook_log;
CREATE POLICY "authenticated_delete_evolution_webhook_log" ON public.evolution_webhook_log FOR DELETE TO authenticated USING (true);
