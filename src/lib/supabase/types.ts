// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      automation_log: {
        Row: {
          context_jsonb: Json | null
          cost_cents: number | null
          error: string | null
          id: string
          latency_ms: number | null
          output: Json | null
          play_name: string
          ran_at: string
          related_id: string | null
          related_type: string | null
          status: string
          tokens_used: number | null
        }
        Insert: {
          context_jsonb?: Json | null
          cost_cents?: number | null
          error?: string | null
          id?: string
          latency_ms?: number | null
          output?: Json | null
          play_name: string
          ran_at?: string
          related_id?: string | null
          related_type?: string | null
          status: string
          tokens_used?: number | null
        }
        Update: {
          context_jsonb?: Json | null
          cost_cents?: number | null
          error?: string | null
          id?: string
          latency_ms?: number | null
          output?: Json | null
          play_name?: string
          ran_at?: string
          related_id?: string | null
          related_type?: string | null
          status?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          calendar_id: string | null
          contacts_jsonb: Json
          contract_end: string | null
          contract_start: string | null
          created_at: string
          cs_responsible_slack_id: string | null
          github_repo: string | null
          id: string
          last_email_at: string | null
          last_meeting_at: string | null
          last_whatsapp_at: string | null
          metadata: Json
          monitored: boolean
          mrr_cents: number | null
          name: string
          nicho: string | null
          notes_path: string | null
          preferred_channel: string | null
          primary_phone: string | null
          program: Database["public"]["Enums"]["program_enum"]
          slug: string | null
          status: string
          tracking_level: Database["public"]["Enums"]["tracking_level_enum"]
          updated_at: string
        }
        Insert: {
          calendar_id?: string | null
          contacts_jsonb?: Json
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          cs_responsible_slack_id?: string | null
          github_repo?: string | null
          id?: string
          last_email_at?: string | null
          last_meeting_at?: string | null
          last_whatsapp_at?: string | null
          metadata?: Json
          monitored?: boolean
          mrr_cents?: number | null
          name: string
          nicho?: string | null
          notes_path?: string | null
          preferred_channel?: string | null
          primary_phone?: string | null
          program?: Database["public"]["Enums"]["program_enum"]
          slug?: string | null
          status?: string
          tracking_level?: Database["public"]["Enums"]["tracking_level_enum"]
          updated_at?: string
        }
        Update: {
          calendar_id?: string | null
          contacts_jsonb?: Json
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          cs_responsible_slack_id?: string | null
          github_repo?: string | null
          id?: string
          last_email_at?: string | null
          last_meeting_at?: string | null
          last_whatsapp_at?: string | null
          metadata?: Json
          monitored?: boolean
          mrr_cents?: number | null
          name?: string
          nicho?: string | null
          notes_path?: string | null
          preferred_channel?: string | null
          primary_phone?: string | null
          program?: Database["public"]["Enums"]["program_enum"]
          slug?: string | null
          status?: string
          tracking_level?: Database["public"]["Enums"]["tracking_level_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      config_kv: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      document: {
        Row: {
          checksum: string | null
          id: number
          meta: Json | null
          path: string
          public: boolean | null
        }
        Insert: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          path: string
          public?: boolean | null
        }
        Update: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          path?: string
          public?: boolean | null
        }
        Relationships: []
      }
      document_section: {
        Row: {
          content: string | null
          document_id: number
          embedding: string | null
          id: number
          token_count: number | null
        }
        Insert: {
          content?: string | null
          document_id: number
          embedding?: string | null
          id?: number
          token_count?: number | null
        }
        Update: {
          content?: string | null
          document_id?: number
          embedding?: string | null
          id?: number
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_section_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_instances: {
        Row: {
          api_key_hint: string | null
          base_url: string
          created_at: string
          display_label: string | null
          id: string
          instance_name: string
          is_default: boolean
          last_connected_at: string | null
          last_disconnected_at: string | null
          metadata: Json
          owner_name: string | null
          owner_phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          api_key_hint?: string | null
          base_url: string
          created_at?: string
          display_label?: string | null
          id?: string
          instance_name: string
          is_default?: boolean
          last_connected_at?: string | null
          last_disconnected_at?: string | null
          metadata?: Json
          owner_name?: string | null
          owner_phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          api_key_hint?: string | null
          base_url?: string
          created_at?: string
          display_label?: string | null
          id?: string
          instance_name?: string
          is_default?: boolean
          last_connected_at?: string | null
          last_disconnected_at?: string | null
          metadata?: Json
          owner_name?: string | null
          owner_phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      evolution_webhook_log: {
        Row: {
          error: string | null
          evolution_event: string | null
          evolution_event_id: string | null
          id: string
          instance_id: string | null
          payload: Json
          processed: boolean
          processed_at: string | null
          received_at: string
        }
        Insert: {
          error?: string | null
          evolution_event?: string | null
          evolution_event_id?: string | null
          id?: string
          instance_id?: string | null
          payload: Json
          processed?: boolean
          processed_at?: string | null
          received_at?: string
        }
        Update: {
          error?: string | null
          evolution_event?: string | null
          evolution_event_id?: string | null
          id?: string
          instance_id?: string | null
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_webhook_log_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          id: string
          is_manual: boolean
          metadata: Json
          name: string
          region: string | null
          scope: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_manual?: boolean
          metadata?: Json
          name: string
          region?: string | null
          scope?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_manual?: boolean
          metadata?: Json
          name?: string
          region?: string | null
          scope?: string
        }
        Relationships: []
      }
      tone_of_voice: {
        Row: {
          client_id: string | null
          created_at: string
          examples_jsonb: Json
          id: string
          last_refined_at: string | null
          scope: Database["public"]["Enums"]["tone_scope_enum"]
          style_guidelines_md: string | null
          total_examples: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          examples_jsonb?: Json
          id?: string
          last_refined_at?: string | null
          scope: Database["public"]["Enums"]["tone_scope_enum"]
          style_guidelines_md?: string | null
          total_examples?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          examples_jsonb?: Json
          id?: string
          last_refined_at?: string | null
          scope?: Database["public"]["Enums"]["tone_scope_enum"]
          style_guidelines_md?: string | null
          total_examples?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tone_of_voice_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_contacts: {
        Row: {
          client_id: string | null
          created_at: string
          display_name: string | null
          first_seen_at: string
          group_participants: Json | null
          group_subject: string | null
          id: string
          instance_id: string | null
          is_business: boolean | null
          is_group: boolean
          last_message_at: string | null
          lid: string | null
          metadata: Json
          monitored: boolean
          phone_number: string | null
          profile_picture_url: string | null
          push_name: string | null
          remote_jid: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          display_name?: string | null
          first_seen_at?: string
          group_participants?: Json | null
          group_subject?: string | null
          id?: string
          instance_id?: string | null
          is_business?: boolean | null
          is_group?: boolean
          last_message_at?: string | null
          lid?: string | null
          metadata?: Json
          monitored?: boolean
          phone_number?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          display_name?: string | null
          first_seen_at?: string
          group_participants?: Json | null
          group_subject?: string | null
          id?: string
          instance_id?: string | null
          is_business?: boolean | null
          is_group?: boolean
          last_message_at?: string | null
          lid?: string | null
          metadata?: Json
          monitored?: boolean
          phone_number?: string | null
          profile_picture_url?: string | null
          push_name?: string | null
          remote_jid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_contacts_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversation_status: {
        Row: {
          client_id: string | null
          contact_id: string
          created_at: string
          id: string
          instance_id: string | null
          last_inbound_at: string | null
          last_outbound_at: string | null
          last_status_change_at: string
          metadata: Json
          pending_inbound_message_id: string | null
          remote_jid: string
          status: Database["public"]["Enums"]["conversation_status_enum"]
          unread_count: number
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          contact_id: string
          created_at?: string
          id?: string
          instance_id?: string | null
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          last_status_change_at?: string
          metadata?: Json
          pending_inbound_message_id?: string | null
          remote_jid: string
          status?: Database["public"]["Enums"]["conversation_status_enum"]
          unread_count?: number
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          instance_id?: string | null
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          last_status_change_at?: string
          metadata?: Json
          pending_inbound_message_id?: string | null
          remote_jid?: string
          status?: Database["public"]["Enums"]["conversation_status_enum"]
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversation_status_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversation_status_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversation_status_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversation_status_pending_inbound_message_id_fkey"
            columns: ["pending_inbound_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          ack_level: number | null
          automated_source: string | null
          caption: string | null
          client_id: string | null
          contact_id: string | null
          content: string | null
          created_at: string
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction_enum"]
          error_reason: string | null
          evolution_event_id: string | null
          evolution_message_id: string | null
          from_me: boolean
          id: string
          instance_id: string | null
          is_automated: boolean
          is_deleted: boolean | null
          is_forwarded: boolean | null
          media_mime: string | null
          media_size_bytes: number | null
          media_storage_path: string | null
          media_type: Database["public"]["Enums"]["message_media_type_enum"]
          media_url: string | null
          message_timestamp: string
          message_type: string | null
          monitored: boolean
          participant_jid: string | null
          quoted_message_id: string | null
          raw_payload: Json | null
          reaction_emoji: string | null
          read_at: string | null
          received_at: string | null
          remote_jid: string
          reply_to_evolution_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status_enum"]
          transcript: string | null
          updated_at: string
          was_audio: boolean
        }
        Insert: {
          ack_level?: number | null
          automated_source?: string | null
          caption?: string | null
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["message_direction_enum"]
          error_reason?: string | null
          evolution_event_id?: string | null
          evolution_message_id?: string | null
          from_me?: boolean
          id?: string
          instance_id?: string | null
          is_automated?: boolean
          is_deleted?: boolean | null
          is_forwarded?: boolean | null
          media_mime?: string | null
          media_size_bytes?: number | null
          media_storage_path?: string | null
          media_type?: Database["public"]["Enums"]["message_media_type_enum"]
          media_url?: string | null
          message_timestamp: string
          message_type?: string | null
          monitored?: boolean
          participant_jid?: string | null
          quoted_message_id?: string | null
          raw_payload?: Json | null
          reaction_emoji?: string | null
          read_at?: string | null
          received_at?: string | null
          remote_jid: string
          reply_to_evolution_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status_enum"]
          transcript?: string | null
          updated_at?: string
          was_audio?: boolean
        }
        Update: {
          ack_level?: number | null
          automated_source?: string | null
          caption?: string | null
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction_enum"]
          error_reason?: string | null
          evolution_event_id?: string | null
          evolution_message_id?: string | null
          from_me?: boolean
          id?: string
          instance_id?: string | null
          is_automated?: boolean
          is_deleted?: boolean | null
          is_forwarded?: boolean | null
          media_mime?: string | null
          media_size_bytes?: number | null
          media_storage_path?: string | null
          media_type?: Database["public"]["Enums"]["message_media_type_enum"]
          media_url?: string | null
          message_timestamp?: string
          message_type?: string | null
          monitored?: boolean
          participant_jid?: string | null
          quoted_message_id?: string | null
          raw_payload?: Json | null
          reaction_emoji?: string | null
          read_at?: string | null
          received_at?: string | null
          remote_jid?: string
          reply_to_evolution_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status_enum"]
          transcript?: string | null
          updated_at?: string
          was_audio?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_quoted_message_id_fkey"
            columns: ["quoted_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_outbound_queue: {
        Row: {
          attempts: number
          batch_id: string | null
          client_id: string | null
          contact_id: string | null
          content: string | null
          created_at: string
          delivered_at: string | null
          evolution_message_id: string | null
          id: string
          instance_id: string | null
          jitter_aplicado_ms: number | null
          last_error: string | null
          lote_position: number | null
          media_type: Database["public"]["Enums"]["message_media_type_enum"]
          media_url: string | null
          metadata: Json
          priority: Database["public"]["Enums"]["outbound_priority_enum"]
          read_at: string | null
          remote_jid: string
          result_message_id: string | null
          scheduled_at: string
          sent_at: string | null
          source_suggestion_id: string | null
          status: Database["public"]["Enums"]["outbound_status_enum"]
          updated_at: string
        }
        Insert: {
          attempts?: number
          batch_id?: string | null
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          evolution_message_id?: string | null
          id?: string
          instance_id?: string | null
          jitter_aplicado_ms?: number | null
          last_error?: string | null
          lote_position?: number | null
          media_type?: Database["public"]["Enums"]["message_media_type_enum"]
          media_url?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["outbound_priority_enum"]
          read_at?: string | null
          remote_jid: string
          result_message_id?: string | null
          scheduled_at: string
          sent_at?: string | null
          source_suggestion_id?: string | null
          status?: Database["public"]["Enums"]["outbound_status_enum"]
          updated_at?: string
        }
        Update: {
          attempts?: number
          batch_id?: string | null
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string
          delivered_at?: string | null
          evolution_message_id?: string | null
          id?: string
          instance_id?: string | null
          jitter_aplicado_ms?: number | null
          last_error?: string | null
          lote_position?: number | null
          media_type?: Database["public"]["Enums"]["message_media_type_enum"]
          media_url?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["outbound_priority_enum"]
          read_at?: string | null
          remote_jid?: string
          result_message_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          source_suggestion_id?: string | null
          status?: Database["public"]["Enums"]["outbound_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_outbound_queue_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_outbound_queue_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_outbound_queue_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_outbound_queue_result_message_id_fkey"
            columns: ["result_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_outbound_queue_source_suggestion_id_fkey"
            columns: ["source_suggestion_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_response_metrics: {
        Row: {
          business_hours_minutes: number | null
          client_id: string | null
          considera_na_media: boolean
          contact_id: string | null
          created_at: string
          id: string
          inbound_at: string
          inbound_message_id: string | null
          instance_id: string | null
          motivo_exclusao: string | null
          outbound_at: string | null
          outbound_message_id: string | null
          raw_minutes: number | null
          remote_jid: string
        }
        Insert: {
          business_hours_minutes?: number | null
          client_id?: string | null
          considera_na_media?: boolean
          contact_id?: string | null
          created_at?: string
          id?: string
          inbound_at: string
          inbound_message_id?: string | null
          instance_id?: string | null
          motivo_exclusao?: string | null
          outbound_at?: string | null
          outbound_message_id?: string | null
          raw_minutes?: number | null
          remote_jid: string
        }
        Update: {
          business_hours_minutes?: number | null
          client_id?: string | null
          considera_na_media?: boolean
          contact_id?: string | null
          created_at?: string
          id?: string
          inbound_at?: string
          inbound_message_id?: string | null
          instance_id?: string | null
          motivo_exclusao?: string | null
          outbound_at?: string | null
          outbound_message_id?: string | null
          raw_minutes?: number | null
          remote_jid?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_response_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_response_metrics_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_response_metrics_inbound_message_id_fkey"
            columns: ["inbound_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_response_metrics_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_response_metrics_outbound_message_id_fkey"
            columns: ["outbound_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_suggestions: {
        Row: {
          approval_count_consecutive: number
          client_id: string | null
          contact_id: string | null
          context_jsonb: Json | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          final_text: string | null
          id: string
          model_used: string | null
          remote_jid: string
          status: Database["public"]["Enums"]["suggestion_status_enum"]
          suggested_text: string
          template_id: string | null
          tone_used: Database["public"]["Enums"]["tone_scope_enum"] | null
          trigger_message_id: string | null
          updated_at: string
        }
        Insert: {
          approval_count_consecutive?: number
          client_id?: string | null
          contact_id?: string | null
          context_jsonb?: Json | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          final_text?: string | null
          id?: string
          model_used?: string | null
          remote_jid: string
          status?: Database["public"]["Enums"]["suggestion_status_enum"]
          suggested_text: string
          template_id?: string | null
          tone_used?: Database["public"]["Enums"]["tone_scope_enum"] | null
          trigger_message_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_count_consecutive?: number
          client_id?: string | null
          contact_id?: string | null
          context_jsonb?: Json | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          final_text?: string | null
          id?: string
          model_used?: string | null
          remote_jid?: string
          status?: Database["public"]["Enums"]["suggestion_status_enum"]
          suggested_text?: string
          template_id?: string | null
          tone_used?: Database["public"]["Enums"]["tone_scope_enum"] | null
          trigger_message_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_suggestions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_suggestions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_suggestions_trigger_message_id_fkey"
            columns: ["trigger_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_sync_state: {
        Row: {
          created_at: string
          id: string
          instance_id: string | null
          last_cursor: string | null
          last_error: string | null
          last_run_at: string | null
          metadata: Json
          range_end: string | null
          range_start: string | null
          remote_jid: string | null
          scope: string
          status: string
          total_failed: number
          total_imported: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id?: string | null
          last_cursor?: string | null
          last_error?: string | null
          last_run_at?: string | null
          metadata?: Json
          range_end?: string | null
          range_start?: string | null
          remote_jid?: string | null
          scope: string
          status?: string
          total_failed?: number
          total_imported?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string | null
          last_cursor?: string | null
          last_error?: string | null
          last_run_at?: string | null
          metadata?: Json
          range_end?: string | null
          range_start?: string | null
          remote_jid?: string | null
          scope?: string
          status?: string
          total_failed?: number
          total_imported?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_sync_state_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "evolution_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates_semanticos: {
        Row: {
          auto_send_enabled: boolean
          client_id: string | null
          consecutive_approvals: number
          created_at: string
          em_prova_ate: string | null
          id: string
          last_used_at: string | null
          metadata: Json
          template_text: string
          tone_scope: Database["public"]["Enums"]["tone_scope_enum"]
          total_uses: number
          trigger_pattern: string | null
          updated_at: string
        }
        Insert: {
          auto_send_enabled?: boolean
          client_id?: string | null
          consecutive_approvals?: number
          created_at?: string
          em_prova_ate?: string | null
          id?: string
          last_used_at?: string | null
          metadata?: Json
          template_text: string
          tone_scope?: Database["public"]["Enums"]["tone_scope_enum"]
          total_uses?: number
          trigger_pattern?: string | null
          updated_at?: string
        }
        Update: {
          auto_send_enabled?: boolean
          client_id?: string | null
          consecutive_approvals?: number
          created_at?: string
          em_prova_ate?: string | null
          id?: string
          last_used_at?: string | null
          metadata?: Json
          template_text?: string
          tone_scope?: Database["public"]["Enums"]["tone_scope_enum"]
          total_uses?: number
          trigger_pattern?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_templates_semanticos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      business_minutes_between: {
        Args: { p_end: string; p_start: string }
        Returns: number
      }
      match_document_sections: {
        Args: {
          embedding: string
          match_count: number
          match_threshold: number
          min_content_length: number
        }
        Returns: {
          content: string
          document_id: number
          id: number
          similarity: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      conversation_status_enum:
        | "finalizada"
        | "pendente_resposta_minha"
        | "aguardando_resposta_cliente"
        | "nova"
      message_direction_enum: "inbound" | "outbound"
      message_media_type_enum:
        | "text"
        | "audio"
        | "image"
        | "video"
        | "document"
        | "sticker"
        | "location"
        | "contact"
        | "reaction"
        | "poll"
        | "unknown"
      message_status_enum:
        | "pending"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "received"
        | "deleted"
      outbound_priority_enum: "immediate" | "normal" | "low"
      outbound_status_enum:
        | "scheduled"
        | "sending"
        | "sent"
        | "failed"
        | "cancelled"
        | "retrying"
      program_enum:
        | "adapta_elite"
        | "adapta_scale"
        | "skip_basic"
        | "skip_gold"
        | "skip_pro"
        | "adapta_pass"
        | "none"
      suggestion_status_enum:
        | "pending"
        | "approved"
        | "edited"
        | "rejected"
        | "auto_sent"
        | "expired"
      tone_scope_enum: "pessoal_geral" | "client"
      tracking_level_enum: "full" | "transcript_only" | "none"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      conversation_status_enum: [
        "finalizada",
        "pendente_resposta_minha",
        "aguardando_resposta_cliente",
        "nova",
      ],
      message_direction_enum: ["inbound", "outbound"],
      message_media_type_enum: [
        "text",
        "audio",
        "image",
        "video",
        "document",
        "sticker",
        "location",
        "contact",
        "reaction",
        "poll",
        "unknown",
      ],
      message_status_enum: [
        "pending",
        "sent",
        "delivered",
        "read",
        "failed",
        "received",
        "deleted",
      ],
      outbound_priority_enum: ["immediate", "normal", "low"],
      outbound_status_enum: [
        "scheduled",
        "sending",
        "sent",
        "failed",
        "cancelled",
        "retrying",
      ],
      program_enum: [
        "adapta_elite",
        "adapta_scale",
        "skip_basic",
        "skip_gold",
        "skip_pro",
        "adapta_pass",
        "none",
      ],
      suggestion_status_enum: [
        "pending",
        "approved",
        "edited",
        "rejected",
        "auto_sent",
        "expired",
      ],
      tone_scope_enum: ["pessoal_geral", "client"],
      tracking_level_enum: ["full", "transcript_only", "none"],
    },
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: automation_log
//   id: uuid (not null, default: uuid_generate_v4())
//   play_name: text (not null)
//   ran_at: timestamp with time zone (not null, default: now())
//   status: text (not null)
//   output: jsonb (nullable)
//   error: text (nullable)
//   tokens_used: integer (nullable)
//   cost_cents: integer (nullable)
//   latency_ms: integer (nullable)
//   context_jsonb: jsonb (nullable)
//   related_id: uuid (nullable)
//   related_type: text (nullable)
// Table: clients
//   id: uuid (not null, default: uuid_generate_v4())
//   name: text (not null)
//   slug: text (nullable)
//   program: program_enum (not null, default: 'none'::program_enum)
//   tracking_level: tracking_level_enum (not null, default: 'full'::tracking_level_enum)
//   status: text (not null, default: 'ativo'::text)
//   primary_phone: text (nullable)
//   contacts_jsonb: jsonb (not null, default: '[]'::jsonb)
//   github_repo: text (nullable)
//   calendar_id: text (nullable)
//   preferred_channel: text (nullable, default: 'whatsapp'::text)
//   cs_responsible_slack_id: text (nullable)
//   nicho: text (nullable)
//   mrr_cents: integer (nullable)
//   contract_start: date (nullable)
//   contract_end: date (nullable)
//   monitored: boolean (not null, default: true)
//   notes_path: text (nullable)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   last_meeting_at: timestamp with time zone (nullable)
//   last_whatsapp_at: timestamp with time zone (nullable)
//   last_email_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: config_kv
//   key: text (not null)
//   value: jsonb (not null)
//   description: text (nullable)
//   updated_at: timestamp with time zone (not null, default: now())
// Table: document
//   id: bigint (not null)
//   path: text (not null)
//   checksum: text (nullable)
//   meta: jsonb (nullable)
//   public: boolean (nullable, default: false)
// Table: document_section
//   id: bigint (not null)
//   document_id: bigint (not null)
//   content: text (nullable)
//   token_count: integer (nullable)
//   embedding: vector (nullable)
// Table: evolution_instances
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_name: text (not null)
//   display_label: text (nullable)
//   base_url: text (not null)
//   api_key_hint: text (nullable)
//   owner_phone: text (nullable)
//   owner_name: text (nullable)
//   status: text (nullable, default: 'unknown'::text)
//   last_connected_at: timestamp with time zone (nullable)
//   last_disconnected_at: timestamp with time zone (nullable)
//   is_default: boolean (not null, default: false)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: evolution_webhook_log
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   evolution_event: text (nullable)
//   evolution_event_id: text (nullable)
//   payload: jsonb (not null)
//   processed: boolean (not null, default: false)
//   processed_at: timestamp with time zone (nullable)
//   error: text (nullable)
//   received_at: timestamp with time zone (not null, default: now())
// Table: holidays
//   id: uuid (not null, default: uuid_generate_v4())
//   date: date (not null)
//   name: text (not null)
//   scope: text (not null, default: 'national'::text)
//   region: text (nullable)
//   is_manual: boolean (not null, default: false)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: tone_of_voice
//   id: uuid (not null, default: uuid_generate_v4())
//   scope: tone_scope_enum (not null)
//   client_id: uuid (nullable)
//   examples_jsonb: jsonb (not null, default: '[]'::jsonb)
//   style_guidelines_md: text (nullable)
//   total_examples: integer (not null, default: 0)
//   last_refined_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_contacts
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   remote_jid: text (not null)
//   phone_number: text (nullable)
//   push_name: text (nullable)
//   display_name: text (nullable)
//   is_group: boolean (not null, default: false)
//   group_subject: text (nullable)
//   group_participants: jsonb (nullable)
//   profile_picture_url: text (nullable)
//   client_id: uuid (nullable)
//   monitored: boolean (not null, default: true)
//   is_business: boolean (nullable, default: false)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   first_seen_at: timestamp with time zone (not null, default: now())
//   last_message_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   lid: text (nullable)
// Table: whatsapp_conversation_status
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   contact_id: uuid (not null)
//   client_id: uuid (nullable)
//   remote_jid: text (not null)
//   status: conversation_status_enum (not null, default: 'nova'::conversation_status_enum)
//   last_inbound_at: timestamp with time zone (nullable)
//   last_outbound_at: timestamp with time zone (nullable)
//   last_status_change_at: timestamp with time zone (not null, default: now())
//   pending_inbound_message_id: uuid (nullable)
//   unread_count: integer (not null, default: 0)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_messages
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   evolution_message_id: text (nullable)
//   evolution_event_id: text (nullable)
//   remote_jid: text (not null)
//   participant_jid: text (nullable)
//   contact_id: uuid (nullable)
//   client_id: uuid (nullable)
//   direction: message_direction_enum (not null)
//   from_me: boolean (not null, default: false)
//   media_type: message_media_type_enum (not null, default: 'text'::message_media_type_enum)
//   content: text (nullable)
//   caption: text (nullable)
//   transcript: text (nullable)
//   was_audio: boolean (not null, default: false)
//   media_url: text (nullable)
//   media_mime: text (nullable)
//   media_size_bytes: bigint (nullable)
//   media_storage_path: text (nullable)
//   quoted_message_id: uuid (nullable)
//   reply_to_evolution_id: text (nullable)
//   is_automated: boolean (not null, default: false)
//   automated_source: text (nullable)
//   monitored: boolean (not null, default: true)
//   status: message_status_enum (not null, default: 'received'::message_status_enum)
//   ack_level: integer (nullable)
//   is_forwarded: boolean (nullable, default: false)
//   is_deleted: boolean (nullable, default: false)
//   reaction_emoji: text (nullable)
//   raw_payload: jsonb (nullable)
//   message_timestamp: timestamp with time zone (not null)
//   received_at: timestamp with time zone (nullable)
//   sent_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   delivered_at: timestamp with time zone (nullable)
//   read_at: timestamp with time zone (nullable)
//   error_reason: text (nullable)
//   message_type: text (nullable)
// Table: whatsapp_outbound_queue
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   contact_id: uuid (nullable)
//   client_id: uuid (nullable)
//   remote_jid: text (not null)
//   content: text (nullable)
//   media_url: text (nullable)
//   media_type: message_media_type_enum (not null, default: 'text'::message_media_type_enum)
//   source_suggestion_id: uuid (nullable)
//   batch_id: uuid (nullable)
//   lote_position: integer (nullable)
//   jitter_aplicado_ms: integer (nullable)
//   priority: outbound_priority_enum (not null, default: 'normal'::outbound_priority_enum)
//   status: outbound_status_enum (not null, default: 'scheduled'::outbound_status_enum)
//   scheduled_at: timestamp with time zone (not null)
//   sent_at: timestamp with time zone (nullable)
//   delivered_at: timestamp with time zone (nullable)
//   read_at: timestamp with time zone (nullable)
//   attempts: integer (not null, default: 0)
//   last_error: text (nullable)
//   evolution_message_id: text (nullable)
//   result_message_id: uuid (nullable)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_response_metrics
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   contact_id: uuid (nullable)
//   client_id: uuid (nullable)
//   remote_jid: text (not null)
//   inbound_message_id: uuid (nullable)
//   outbound_message_id: uuid (nullable)
//   inbound_at: timestamp with time zone (not null)
//   outbound_at: timestamp with time zone (nullable)
//   raw_minutes: numeric (nullable)
//   business_hours_minutes: numeric (nullable)
//   considera_na_media: boolean (not null, default: true)
//   motivo_exclusao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_suggestions
//   id: uuid (not null, default: uuid_generate_v4())
//   trigger_message_id: uuid (nullable)
//   contact_id: uuid (nullable)
//   client_id: uuid (nullable)
//   remote_jid: text (not null)
//   suggested_text: text (not null)
//   final_text: text (nullable)
//   tone_used: tone_scope_enum (nullable)
//   model_used: text (nullable)
//   template_id: uuid (nullable)
//   context_jsonb: jsonb (nullable)
//   status: suggestion_status_enum (not null, default: 'pending'::suggestion_status_enum)
//   approval_count_consecutive: integer (not null, default: 0)
//   decided_by: text (nullable)
//   decided_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_sync_state
//   id: uuid (not null, default: uuid_generate_v4())
//   instance_id: uuid (nullable)
//   scope: text (not null)
//   remote_jid: text (nullable)
//   status: text (not null, default: 'pending'::text)
//   range_start: timestamp with time zone (nullable)
//   range_end: timestamp with time zone (nullable)
//   last_cursor: text (nullable)
//   total_imported: integer (not null, default: 0)
//   total_failed: integer (not null, default: 0)
//   last_run_at: timestamp with time zone (nullable)
//   last_error: text (nullable)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: whatsapp_templates_semanticos
//   id: uuid (not null, default: uuid_generate_v4())
//   template_text: text (not null)
//   trigger_pattern: text (nullable)
//   tone_scope: tone_scope_enum (not null, default: 'pessoal_geral'::tone_scope_enum)
//   client_id: uuid (nullable)
//   consecutive_approvals: integer (not null, default: 0)
//   total_uses: integer (not null, default: 0)
//   last_used_at: timestamp with time zone (nullable)
//   em_prova_ate: timestamp with time zone (nullable)
//   auto_send_enabled: boolean (not null, default: false)
//   metadata: jsonb (not null, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: automation_log
//   PRIMARY KEY automation_log_pkey: PRIMARY KEY (id)
// Table: clients
//   PRIMARY KEY clients_pkey: PRIMARY KEY (id)
//   UNIQUE clients_slug_key: UNIQUE (slug)
// Table: config_kv
//   PRIMARY KEY config_kv_pkey: PRIMARY KEY (key)
// Table: document
//   UNIQUE document_path_key: UNIQUE (path)
//   PRIMARY KEY document_pkey: PRIMARY KEY (id)
// Table: document_section
//   FOREIGN KEY document_section_document_id_fkey: FOREIGN KEY (document_id) REFERENCES document(id) ON DELETE CASCADE
//   PRIMARY KEY document_section_pkey: PRIMARY KEY (id)
// Table: evolution_instances
//   UNIQUE evolution_instances_instance_name_key: UNIQUE (instance_name)
//   PRIMARY KEY evolution_instances_pkey: PRIMARY KEY (id)
// Table: evolution_webhook_log
//   FOREIGN KEY evolution_webhook_log_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE SET NULL
//   PRIMARY KEY evolution_webhook_log_pkey: PRIMARY KEY (id)
// Table: holidays
//   PRIMARY KEY holidays_pkey: PRIMARY KEY (id)
// Table: tone_of_voice
//   FOREIGN KEY tone_of_voice_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
//   PRIMARY KEY tone_of_voice_pkey: PRIMARY KEY (id)
//   CHECK tov_scope_client_consistency: CHECK ((((scope = 'pessoal_geral'::tone_scope_enum) AND (client_id IS NULL)) OR ((scope = 'client'::tone_scope_enum) AND (client_id IS NOT NULL))))
// Table: whatsapp_contacts
//   FOREIGN KEY whatsapp_contacts_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_contacts_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE SET NULL
//   UNIQUE whatsapp_contacts_instance_id_remote_jid_key: UNIQUE (instance_id, remote_jid)
//   PRIMARY KEY whatsapp_contacts_pkey: PRIMARY KEY (id)
// Table: whatsapp_conversation_status
//   FOREIGN KEY whatsapp_conversation_status_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_conversation_status_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE CASCADE
//   UNIQUE whatsapp_conversation_status_instance_id_contact_id_key: UNIQUE (instance_id, contact_id)
//   FOREIGN KEY whatsapp_conversation_status_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE CASCADE
//   FOREIGN KEY whatsapp_conversation_status_pending_inbound_message_id_fkey: FOREIGN KEY (pending_inbound_message_id) REFERENCES whatsapp_messages(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_conversation_status_pkey: PRIMARY KEY (id)
// Table: whatsapp_messages
//   FOREIGN KEY whatsapp_messages_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_messages_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE SET NULL
//   UNIQUE whatsapp_messages_instance_id_evolution_message_id_key: UNIQUE (instance_id, evolution_message_id)
//   FOREIGN KEY whatsapp_messages_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_messages_quoted_message_id_fkey: FOREIGN KEY (quoted_message_id) REFERENCES whatsapp_messages(id) ON DELETE SET NULL
// Table: whatsapp_outbound_queue
//   FOREIGN KEY whatsapp_outbound_queue_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_outbound_queue_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_outbound_queue_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_outbound_queue_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_outbound_queue_result_message_id_fkey: FOREIGN KEY (result_message_id) REFERENCES whatsapp_messages(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_outbound_queue_source_suggestion_id_fkey: FOREIGN KEY (source_suggestion_id) REFERENCES whatsapp_suggestions(id) ON DELETE SET NULL
// Table: whatsapp_response_metrics
//   FOREIGN KEY whatsapp_response_metrics_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_response_metrics_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_response_metrics_inbound_message_id_fkey: FOREIGN KEY (inbound_message_id) REFERENCES whatsapp_messages(id) ON DELETE CASCADE
//   FOREIGN KEY whatsapp_response_metrics_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_response_metrics_outbound_message_id_fkey: FOREIGN KEY (outbound_message_id) REFERENCES whatsapp_messages(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_response_metrics_pkey: PRIMARY KEY (id)
// Table: whatsapp_suggestions
//   FOREIGN KEY whatsapp_suggestions_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
//   FOREIGN KEY whatsapp_suggestions_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES whatsapp_contacts(id) ON DELETE CASCADE
//   PRIMARY KEY whatsapp_suggestions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY whatsapp_suggestions_trigger_message_id_fkey: FOREIGN KEY (trigger_message_id) REFERENCES whatsapp_messages(id) ON DELETE CASCADE
// Table: whatsapp_sync_state
//   FOREIGN KEY whatsapp_sync_state_instance_id_fkey: FOREIGN KEY (instance_id) REFERENCES evolution_instances(id) ON DELETE CASCADE
//   PRIMARY KEY whatsapp_sync_state_pkey: PRIMARY KEY (id)
// Table: whatsapp_templates_semanticos
//   FOREIGN KEY whatsapp_templates_semanticos_client_id_fkey: FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
//   PRIMARY KEY whatsapp_templates_semanticos_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: document
//   Policy "authenticated_delete_document" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_document" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_document" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_document" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: document_section
//   Policy "authenticated_delete_document_section" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_document_section" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_document_section" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_document_section" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION business_minutes_between(timestamp with time zone, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.business_minutes_between(p_start timestamp with time zone, p_end timestamp with time zone)
//    RETURNS numeric
//    LANGUAGE plpgsql
//    STABLE
//   AS $function$
//   DECLARE
//     cfg JSONB;
//     tz TEXT;
//     bh_start TIME;
//     bh_end TIME;
//     bh_days INTEGER[];
//     cur TIMESTAMPTZ;
//     total_minutes NUMERIC := 0;
//     day_start TIMESTAMPTZ;
//     day_end TIMESTAMPTZ;
//     is_holiday BOOLEAN;
//     dow_local INTEGER;
//     segment_start TIMESTAMPTZ;
//     segment_end TIMESTAMPTZ;
//   BEGIN
//     IF p_start IS NULL OR p_end IS NULL OR p_end <= p_start THEN
//       RETURN 0;
//     END IF;
//     SELECT value INTO cfg FROM public.config_kv WHERE key='business_hours';
//     IF cfg IS NULL THEN
//       cfg := '{"timezone":"America/Sao_Paulo","start":"09:00","end":"18:00","days":[1,2,3,4,5]}'::jsonb;
//     END IF;
//     tz := cfg->>'timezone';
//     bh_start := (cfg->>'start')::time;
//     bh_end := (cfg->>'end')::time;
//     SELECT array_agg((d)::int) INTO bh_days FROM jsonb_array_elements_text(cfg->'days') d;
//   
//     cur := p_start;
//     WHILE cur < p_end LOOP
//       day_start := date_trunc('day', cur AT TIME ZONE tz) AT TIME ZONE tz;
//       dow_local := EXTRACT(ISODOW FROM (cur AT TIME ZONE tz))::int;
//       SELECT EXISTS(SELECT 1 FROM public.holidays WHERE date = (cur AT TIME ZONE tz)::date AND scope IN ('national','state')) INTO is_holiday;
//   
//       IF dow_local = ANY(bh_days) AND NOT is_holiday THEN
//         segment_start := GREATEST(cur, (day_start::date::text || ' ' || bh_start::text)::timestamp AT TIME ZONE tz);
//         segment_end := LEAST(p_end, (day_start::date::text || ' ' || bh_end::text)::timestamp AT TIME ZONE tz);
//         IF segment_end > segment_start THEN
//           total_minutes := total_minutes + EXTRACT(EPOCH FROM (segment_end - segment_start))/60;
//         END IF;
//       END IF;
//   
//       cur := day_start + INTERVAL '1 day';
//     END LOOP;
//   
//     RETURN total_minutes;
//   END;
//   $function$
//   
// FUNCTION match_document_sections(vector, double precision, integer, integer)
//   CREATE OR REPLACE FUNCTION public.match_document_sections(embedding vector, match_threshold double precision, match_count integer, min_content_length integer)
//    RETURNS TABLE(id bigint, document_id bigint, content text, similarity double precision)
//    LANGUAGE plpgsql
//   AS $function$
//   begin
//     return query
//     select
//       document_section.id,
//       document_section.document_id,
//       document_section.content,
//       (document_section.embedding <#> embedding) * -1 as similarity
//     from document_section
//     where length(document_section.content) >= min_content_length
//     and (document_section.embedding <#> embedding) * -1 > match_threshold
//     order by document_section.embedding <#> embedding
//     limit match_count;
//   end;
//   $function$
//   
// FUNCTION set_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
//   $function$
//   

// --- TRIGGERS ---
// Table: clients
//   trg_clients_updated_at: CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: evolution_instances
//   trg_evolution_updated_at: CREATE TRIGGER trg_evolution_updated_at BEFORE UPDATE ON public.evolution_instances FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: tone_of_voice
//   trg_tov_updated_at: CREATE TRIGGER trg_tov_updated_at BEFORE UPDATE ON public.tone_of_voice FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_contacts
//   trg_wpp_contacts_updated_at: CREATE TRIGGER trg_wpp_contacts_updated_at BEFORE UPDATE ON public.whatsapp_contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_conversation_status
//   trg_wpp_convstatus_updated_at: CREATE TRIGGER trg_wpp_convstatus_updated_at BEFORE UPDATE ON public.whatsapp_conversation_status FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_messages
//   trg_wpp_msg_updated_at: CREATE TRIGGER trg_wpp_msg_updated_at BEFORE UPDATE ON public.whatsapp_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_outbound_queue
//   trg_wpp_queue_updated_at: CREATE TRIGGER trg_wpp_queue_updated_at BEFORE UPDATE ON public.whatsapp_outbound_queue FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_suggestions
//   trg_wpp_sugg_updated_at: CREATE TRIGGER trg_wpp_sugg_updated_at BEFORE UPDATE ON public.whatsapp_suggestions FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_sync_state
//   trg_wpp_sync_updated_at: CREATE TRIGGER trg_wpp_sync_updated_at BEFORE UPDATE ON public.whatsapp_sync_state FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: whatsapp_templates_semanticos
//   trg_wpp_tpl_updated_at: CREATE TRIGGER trg_wpp_tpl_updated_at BEFORE UPDATE ON public.whatsapp_templates_semanticos FOR EACH ROW EXECUTE FUNCTION set_updated_at()

// --- INDEXES ---
// Table: automation_log
//   CREATE INDEX idx_automation_log_play ON public.automation_log USING btree (play_name, ran_at DESC)
//   CREATE INDEX idx_automation_log_status ON public.automation_log USING btree (status)
// Table: clients
//   CREATE UNIQUE INDEX clients_slug_key ON public.clients USING btree (slug)
//   CREATE INDEX idx_clients_primary_phone ON public.clients USING btree (primary_phone)
//   CREATE INDEX idx_clients_program ON public.clients USING btree (program)
//   CREATE INDEX idx_clients_status ON public.clients USING btree (status)
// Table: document
//   CREATE UNIQUE INDEX document_path_key ON public.document USING btree (path)
// Table: evolution_instances
//   CREATE UNIQUE INDEX evolution_instances_instance_name_key ON public.evolution_instances USING btree (instance_name)
// Table: evolution_webhook_log
//   CREATE INDEX idx_evol_webhook_event ON public.evolution_webhook_log USING btree (evolution_event)
//   CREATE INDEX idx_evol_webhook_processed ON public.evolution_webhook_log USING btree (processed)
//   CREATE INDEX idx_evol_webhook_received_at ON public.evolution_webhook_log USING btree (received_at DESC)
// Table: holidays
//   CREATE INDEX idx_holidays_date ON public.holidays USING btree (date)
//   CREATE UNIQUE INDEX uq_holidays_no_region ON public.holidays USING btree (date, scope) WHERE (region IS NULL)
//   CREATE UNIQUE INDEX uq_holidays_with_region ON public.holidays USING btree (date, scope, region) WHERE (region IS NOT NULL)
// Table: tone_of_voice
//   CREATE UNIQUE INDEX uq_tov_client ON public.tone_of_voice USING btree (client_id) WHERE (scope = 'client'::tone_scope_enum)
//   CREATE UNIQUE INDEX uq_tov_general ON public.tone_of_voice USING btree (scope) WHERE (scope = 'pessoal_geral'::tone_scope_enum)
// Table: whatsapp_contacts
//   CREATE UNIQUE INDEX idx_whatsapp_contacts_instance_lid ON public.whatsapp_contacts USING btree (instance_id, lid) WHERE (lid IS NOT NULL)
//   CREATE INDEX idx_wpp_contacts_client ON public.whatsapp_contacts USING btree (client_id)
//   CREATE INDEX idx_wpp_contacts_jid ON public.whatsapp_contacts USING btree (remote_jid)
//   CREATE INDEX idx_wpp_contacts_phone ON public.whatsapp_contacts USING btree (phone_number)
//   CREATE UNIQUE INDEX whatsapp_contacts_instance_id_remote_jid_key ON public.whatsapp_contacts USING btree (instance_id, remote_jid)
// Table: whatsapp_conversation_status
//   CREATE INDEX idx_wpp_convstatus_client ON public.whatsapp_conversation_status USING btree (client_id)
//   CREATE INDEX idx_wpp_convstatus_status ON public.whatsapp_conversation_status USING btree (status)
//   CREATE UNIQUE INDEX whatsapp_conversation_status_instance_id_contact_id_key ON public.whatsapp_conversation_status USING btree (instance_id, contact_id)
// Table: whatsapp_messages
//   CREATE INDEX idx_whatsapp_messages_evolution_id ON public.whatsapp_messages USING btree (evolution_message_id) WHERE (evolution_message_id IS NOT NULL)
//   CREATE INDEX idx_wpp_msg_client_ts ON public.whatsapp_messages USING btree (client_id, message_timestamp DESC)
//   CREATE INDEX idx_wpp_msg_content_trgm ON public.whatsapp_messages USING gin (content gin_trgm_ops)
//   CREATE INDEX idx_wpp_msg_direction ON public.whatsapp_messages USING btree (direction)
//   CREATE INDEX idx_wpp_msg_is_automated ON public.whatsapp_messages USING btree (is_automated)
//   CREATE INDEX idx_wpp_msg_remote_jid_ts ON public.whatsapp_messages USING btree (remote_jid, message_timestamp DESC)
//   CREATE INDEX idx_wpp_msg_status ON public.whatsapp_messages USING btree (status)
//   CREATE UNIQUE INDEX whatsapp_messages_instance_id_evolution_message_id_key ON public.whatsapp_messages USING btree (instance_id, evolution_message_id)
// Table: whatsapp_outbound_queue
//   CREATE INDEX idx_wpp_queue_batch ON public.whatsapp_outbound_queue USING btree (batch_id)
//   CREATE INDEX idx_wpp_queue_status_sched ON public.whatsapp_outbound_queue USING btree (status, scheduled_at)
// Table: whatsapp_response_metrics
//   CREATE INDEX idx_wpp_metrics_client ON public.whatsapp_response_metrics USING btree (client_id)
//   CREATE INDEX idx_wpp_metrics_inbound_at ON public.whatsapp_response_metrics USING btree (inbound_at DESC)
// Table: whatsapp_suggestions
//   CREATE INDEX idx_wpp_sugg_client ON public.whatsapp_suggestions USING btree (client_id)
//   CREATE INDEX idx_wpp_sugg_remote_jid ON public.whatsapp_suggestions USING btree (remote_jid)
//   CREATE INDEX idx_wpp_sugg_status ON public.whatsapp_suggestions USING btree (status)
// Table: whatsapp_sync_state
//   CREATE INDEX idx_wpp_sync_state_status ON public.whatsapp_sync_state USING btree (status)
// Table: whatsapp_templates_semanticos
//   CREATE INDEX idx_wpp_templates_auto ON public.whatsapp_templates_semanticos USING btree (auto_send_enabled)

