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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      abonnements_pro: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          profile_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          profile_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          profile_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      account_deletions: {
        Row: {
          cancel_token: string
          cancelled_at: string | null
          executed_at: string | null
          id: string
          requested_at: string
          scheduled_at: string
          status: string
          user_id: string
        }
        Insert: {
          cancel_token?: string
          cancelled_at?: string | null
          executed_at?: string | null
          id?: string
          requested_at?: string
          scheduled_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cancel_token?: string
          cancelled_at?: string | null
          executed_at?: string | null
          id?: string
          requested_at?: string
          scheduled_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_alerts: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          details: Json | null
          id: string
          message: string
          priority: string
          resolved_at: string | null
          source: string
          status: string
          type: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          message: string
          priority?: string
          resolved_at?: string | null
          source: string
          status?: string
          type: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          message?: string
          priority?: string
          resolved_at?: string | null
          source?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      aggregation_logs: {
        Row: {
          annonce_id: string | null
          created_at: string
          details: Json
          event_type: string
          id: string
          native_annonce_id: string | null
          source: string
        }
        Insert: {
          annonce_id?: string | null
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          native_annonce_id?: string | null
          source: string
        }
        Update: {
          annonce_id?: string | null
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          native_annonce_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "aggregation_logs_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregation_logs_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregation_logs_native_annonce_id_fkey"
            columns: ["native_annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aggregation_logs_native_annonce_id_fkey"
            columns: ["native_annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
        ]
      }
      aggregation_runs: {
        Row: {
          annonces_expired: number
          annonces_found: number
          annonces_inserted: number
          annonces_updated: number
          completed_at: string | null
          consecutive_failures: number
          created_at: string
          duplicates_skipped: number
          duration_ms: number | null
          errors: Json
          id: string
          run_status: string
          source: string
          started_at: string
        }
        Insert: {
          annonces_expired?: number
          annonces_found?: number
          annonces_inserted?: number
          annonces_updated?: number
          completed_at?: string | null
          consecutive_failures?: number
          created_at?: string
          duplicates_skipped?: number
          duration_ms?: number | null
          errors?: Json
          id?: string
          run_status: string
          source: string
          started_at?: string
        }
        Update: {
          annonces_expired?: number
          annonces_found?: number
          annonces_inserted?: number
          annonces_updated?: number
          completed_at?: string | null
          consecutive_failures?: number
          created_at?: string
          duplicates_skipped?: number
          duration_ms?: number | null
          errors?: Json
          id?: string
          run_status?: string
          source?: string
          started_at?: string
        }
        Relationships: []
      }
      annonces: {
        Row: {
          adresse_complete: string | null
          archived_at: string | null
          closed_at: string | null
          code_postal: string | null
          created_at: string
          date_debut: string
          date_fin: string
          description: string | null
          freshness_reminder_count: number
          freshness_reminder_j3_at: string | null
          freshness_reminder_j7_at: string | null
          hidden: boolean
          id: string
          is_urgent: boolean
          location: unknown
          merged_with_native_id: string | null
          profile_id: string | null
          published_at: string
          retrocession: number
          retrocession_moyenne_zone: number | null
          source: string
          source_id: string | null
          source_last_verified_at: string | null
          source_url: string | null
          specialites: Json
          statut: string
          type_annonce: string
          type_cabinet: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          adresse_complete?: string | null
          archived_at?: string | null
          closed_at?: string | null
          code_postal?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          description?: string | null
          freshness_reminder_count?: number
          freshness_reminder_j3_at?: string | null
          freshness_reminder_j7_at?: string | null
          hidden?: boolean
          id?: string
          is_urgent?: boolean
          location?: unknown
          merged_with_native_id?: string | null
          profile_id?: string | null
          published_at?: string
          retrocession: number
          retrocession_moyenne_zone?: number | null
          source?: string
          source_id?: string | null
          source_last_verified_at?: string | null
          source_url?: string | null
          specialites?: Json
          statut?: string
          type_annonce?: string
          type_cabinet?: string | null
          updated_at?: string
          ville: string
        }
        Update: {
          adresse_complete?: string | null
          archived_at?: string | null
          closed_at?: string | null
          code_postal?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          description?: string | null
          freshness_reminder_count?: number
          freshness_reminder_j3_at?: string | null
          freshness_reminder_j7_at?: string | null
          hidden?: boolean
          id?: string
          is_urgent?: boolean
          location?: unknown
          merged_with_native_id?: string | null
          profile_id?: string | null
          published_at?: string
          retrocession?: number
          retrocession_moyenne_zone?: number | null
          source?: string
          source_id?: string | null
          source_last_verified_at?: string | null
          source_url?: string | null
          specialites?: Json
          statut?: string
          type_annonce?: string
          type_cabinet?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: [
          {
            foreignKeyName: "annonces_merged_with_native_id_fkey"
            columns: ["merged_with_native_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annonces_merged_with_native_id_fkey"
            columns: ["merged_with_native_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      avis: {
        Row: {
          anonyme_until: string
          auteur_id: string
          contrat_id: string
          created_at: string
          destinataire_id: string
          id: string
          note: number
          tags: string[]
        }
        Insert: {
          anonyme_until?: string
          auteur_id: string
          contrat_id: string
          created_at?: string
          destinataire_id: string
          id?: string
          note: number
          tags?: string[]
        }
        Update: {
          anonyme_until?: string
          auteur_id?: string
          contrat_id?: string
          created_at?: string
          destinataire_id?: string
          id?: string
          note?: number
          tags?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "avis_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
        ]
      }
      calendrier: {
        Row: {
          candidature_id: string | null
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          profile_id: string
          type: string
          updated_at: string
        }
        Insert: {
          candidature_id?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          id?: string
          profile_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          candidature_id?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          profile_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendrier_candidature_id_fkey"
            columns: ["candidature_id"]
            isOneToOne: false
            referencedRelation: "candidatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendrier_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendrier_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_pending_reverify"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendrier_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatures: {
        Row: {
          annonce_id: string
          created_at: string
          id: string
          message: string | null
          remplacant_id: string
          responded_at: string | null
          statut: string
          updated_at: string
          viewed_at: string | null
          warnings: Json | null
        }
        Insert: {
          annonce_id: string
          created_at?: string
          id?: string
          message?: string | null
          remplacant_id: string
          responded_at?: string | null
          statut?: string
          updated_at?: string
          viewed_at?: string | null
          warnings?: Json | null
        }
        Update: {
          annonce_id?: string
          created_at?: string
          id?: string
          message?: string | null
          remplacant_id?: string
          responded_at?: string | null
          statut?: string
          updated_at?: string
          viewed_at?: string | null
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatures_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatures_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
        ]
      }
      cgu_versions: {
        Row: {
          description: string
          id: number
          published_at: string
        }
        Insert: {
          description: string
          id: number
          published_at?: string
        }
        Update: {
          description?: string
          id?: number
          published_at?: string
        }
        Relationships: []
      }
      config_mots_sensibles: {
        Row: {
          actif: boolean
          categorie: string
          created_at: string
          id: string
          mot: string
        }
        Insert: {
          actif?: boolean
          categorie?: string
          created_at?: string
          id?: string
          mot: string
        }
        Update: {
          actif?: boolean
          categorie?: string
          created_at?: string
          id?: string
          mot?: string
        }
        Relationships: []
      }
      contrats: {
        Row: {
          annonce_id: string
          candidature_id: string
          clauses_obligatoires: Json
          clauses_optionnelles: Json
          confirme_par_remplacant_at: string | null
          confirme_par_titulaire_at: string | null
          created_at: string | null
          donnees: Json
          id: string
          remplacant_id: string
          statut: string
          template_version: string
          titulaire_id: string
          updated_at: string | null
        }
        Insert: {
          annonce_id: string
          candidature_id: string
          clauses_obligatoires?: Json
          clauses_optionnelles?: Json
          confirme_par_remplacant_at?: string | null
          confirme_par_titulaire_at?: string | null
          created_at?: string | null
          donnees?: Json
          id?: string
          remplacant_id: string
          statut?: string
          template_version?: string
          titulaire_id: string
          updated_at?: string | null
        }
        Update: {
          annonce_id?: string
          candidature_id?: string
          clauses_obligatoires?: Json
          clauses_optionnelles?: Json
          confirme_par_remplacant_at?: string | null
          confirme_par_titulaire_at?: string | null
          created_at?: string | null
          donnees?: Json
          id?: string
          remplacant_id?: string
          statut?: string
          template_version?: string
          titulaire_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contrats_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrats_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrats_candidature_id_fkey"
            columns: ["candidature_id"]
            isOneToOne: false
            referencedRelation: "candidatures"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          annonce_id: string
          candidature_id: string
          created_at: string
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          participant_1_id: string
          participant_2_id: string
        }
        Insert: {
          annonce_id: string
          candidature_id: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          participant_1_id: string
          participant_2_id: string
        }
        Update: {
          annonce_id?: string
          candidature_id?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          participant_1_id?: string
          participant_2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_candidature_id_fkey"
            columns: ["candidature_id"]
            isOneToOne: true
            referencedRelation: "candidatures"
            referencedColumns: ["id"]
          },
        ]
      }
      favoris: {
        Row: {
          created_at: string
          id: string
          note: string | null
          remplacant_id: string
          titulaire_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          remplacant_id: string
          titulaire_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          remplacant_id?: string
          titulaire_id?: string
        }
        Relationships: []
      }
      message_rate_limits: {
        Row: {
          message_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          message_count?: number
          user_id: string
          window_start: string
        }
        Update: {
          message_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          contains_links: boolean | null
          content: string
          conversation_id: string
          created_at: string
          flagged_phishing: boolean
          hidden: boolean
          id: string
          is_system_message: boolean
          read_at: string | null
          sender_id: string
        }
        Insert: {
          contains_links?: boolean | null
          content: string
          conversation_id: string
          created_at?: string
          flagged_phishing?: boolean
          hidden?: boolean
          id?: string
          is_system_message?: boolean
          read_at?: string | null
          sender_id: string
        }
        Update: {
          contains_links?: boolean | null
          content?: string
          conversation_id?: string
          created_at?: string
          flagged_phishing?: boolean
          hidden?: boolean
          id?: string
          is_system_message?: boolean
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          priority: string
          recipient_id: string
          retry_count: number
          scheduled_at: string
          sent_at: string | null
          status: string
        }
        Insert: {
          channel?: string
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json
          priority?: string
          recipient_id: string
          retry_count?: number
          scheduled_at?: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          priority?: string
          recipient_id?: string
          retry_count?: number
          scheduled_at?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      paiements: {
        Row: {
          annonce_id: string
          commission_jim_cents: number
          commission_type: string
          contested_at: string | null
          contrat_id: string
          created_at: string
          id: string
          montant_encaisse_cents: number
          montant_net_remplacant_cents: number
          montant_retrocession_cents: number
          paid_at: string | null
          part_titulaire_cents: number
          remplacant_id: string
          resolved_at: string | null
          source_montant: string
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          taux_retrocession: number
          titulaire_id: string
          updated_at: string
        }
        Insert: {
          annonce_id: string
          commission_jim_cents?: number
          commission_type?: string
          contested_at?: string | null
          contrat_id: string
          created_at?: string
          id?: string
          montant_encaisse_cents: number
          montant_net_remplacant_cents: number
          montant_retrocession_cents: number
          paid_at?: string | null
          part_titulaire_cents: number
          remplacant_id: string
          resolved_at?: string | null
          source_montant?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          taux_retrocession: number
          titulaire_id: string
          updated_at?: string
        }
        Update: {
          annonce_id?: string
          commission_jim_cents?: number
          commission_type?: string
          contested_at?: string | null
          contrat_id?: string
          created_at?: string
          id?: string
          montant_encaisse_cents?: number
          montant_net_remplacant_cents?: number
          montant_retrocession_cents?: number
          paid_at?: string | null
          part_titulaire_cents?: number
          remplacant_id?: string
          resolved_at?: string | null
          source_montant?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          taux_retrocession?: number
          titulaire_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paiements_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: true
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
        ]
      }
      parrainages: {
        Row: {
          activated_at: string | null
          code: string
          created_at: string
          filleul_id: string | null
          id: string
          parrain_id: string
          status: string
        }
        Insert: {
          activated_at?: string | null
          code: string
          created_at?: string
          filleul_id?: string | null
          id?: string
          parrain_id: string
          status?: string
        }
        Update: {
          activated_at?: string | null
          code?: string
          created_at?: string
          filleul_id?: string | null
          id?: string
          parrain_id?: string
          status?: string
        }
        Relationships: []
      }
      professions: {
        Row: {
          code: string
          config: Json
          created_at: string
          id: string
          is_active: boolean
          label: string
          label_plural: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          label_plural: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          label_plural?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          blocked_reason: string | null
          cgu_accepted_at: string | null
          cgu_version: number
          city: string | null
          created_at: string
          daily_push_count: number
          department: string | null
          email: string
          email_digest_enabled: boolean
          fcm_token: string | null
          first_name: string
          id: string
          is_ambassadeur: boolean
          is_blocked: boolean
          is_pro: boolean
          last_name: string
          last_push_sent_at: string | null
          launch_period_active: boolean
          location: unknown
          mobility_radius_km: number
          nb_avis: number
          nb_remplacements: number
          note_moyenne: number | null
          parrainage_code: string | null
          phone: string | null
          profession_id: string | null
          push_annonces: boolean
          push_candidatures: boolean
          push_messages: boolean
          push_paused: boolean
          push_token: string | null
          push_token_type: string | null
          rcp_verified: boolean
          region: string | null
          role: string
          rpps_cache_expires_at: string | null
          rpps_last_attempt_at: string | null
          rpps_number: string | null
          rpps_verification_status: string | null
          rpps_verified: boolean
          rpps_verified_at: string | null
          score_fiabilite: number | null
          specialties: string[]
          stripe_account_id: string | null
          stripe_onboarding_status: string
          suspended: boolean
          suspended_at: string | null
          suspended_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          blocked_reason?: string | null
          cgu_accepted_at?: string | null
          cgu_version?: number
          city?: string | null
          created_at?: string
          daily_push_count?: number
          department?: string | null
          email: string
          email_digest_enabled?: boolean
          fcm_token?: string | null
          first_name?: string
          id?: string
          is_ambassadeur?: boolean
          is_blocked?: boolean
          is_pro?: boolean
          last_name?: string
          last_push_sent_at?: string | null
          launch_period_active?: boolean
          location?: unknown
          mobility_radius_km?: number
          nb_avis?: number
          nb_remplacements?: number
          note_moyenne?: number | null
          parrainage_code?: string | null
          phone?: string | null
          profession_id?: string | null
          push_annonces?: boolean
          push_candidatures?: boolean
          push_messages?: boolean
          push_paused?: boolean
          push_token?: string | null
          push_token_type?: string | null
          rcp_verified?: boolean
          region?: string | null
          role: string
          rpps_cache_expires_at?: string | null
          rpps_last_attempt_at?: string | null
          rpps_number?: string | null
          rpps_verification_status?: string | null
          rpps_verified?: boolean
          rpps_verified_at?: string | null
          score_fiabilite?: number | null
          specialties?: string[]
          stripe_account_id?: string | null
          stripe_onboarding_status?: string
          suspended?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          blocked_reason?: string | null
          cgu_accepted_at?: string | null
          cgu_version?: number
          city?: string | null
          created_at?: string
          daily_push_count?: number
          department?: string | null
          email?: string
          email_digest_enabled?: boolean
          fcm_token?: string | null
          first_name?: string
          id?: string
          is_ambassadeur?: boolean
          is_blocked?: boolean
          is_pro?: boolean
          last_name?: string
          last_push_sent_at?: string | null
          launch_period_active?: boolean
          location?: unknown
          mobility_radius_km?: number
          nb_avis?: number
          nb_remplacements?: number
          note_moyenne?: number | null
          parrainage_code?: string | null
          phone?: string | null
          profession_id?: string | null
          push_annonces?: boolean
          push_candidatures?: boolean
          push_messages?: boolean
          push_paused?: boolean
          push_token?: string | null
          push_token_type?: string | null
          rcp_verified?: boolean
          region?: string | null
          role?: string
          rpps_cache_expires_at?: string | null
          rpps_last_attempt_at?: string | null
          rpps_number?: string | null
          rpps_verification_status?: string | null
          rpps_verified?: boolean
          rpps_verified_at?: string | null
          score_fiabilite?: number | null
          specialties?: string[]
          stripe_account_id?: string | null
          stripe_onboarding_status?: string
          suspended?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
        ]
      }
      propositions_directes: {
        Row: {
          annonce_id: string | null
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          remplacant_id: string
          responded_at: string | null
          retrocession: number
          status: string
          titulaire_id: string
        }
        Insert: {
          annonce_id?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          id?: string
          remplacant_id: string
          responded_at?: string | null
          retrocession: number
          status?: string
          titulaire_id: string
        }
        Update: {
          annonce_id?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          remplacant_id?: string
          responded_at?: string | null
          retrocession?: number
          status?: string
          titulaire_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propositions_directes_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propositions_directes_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces_freshness_due"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          max_requests: number
          request_count: number
          window_duration: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          max_requests: number
          request_count?: number
          window_duration: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          max_requests?: number
          request_count?: number
          window_duration?: string
          window_start?: string
        }
        Relationships: []
      }
      search_rate_limits: {
        Row: {
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      signalements: {
        Row: {
          action_prise: string | null
          categorie: string
          contenu_id: string
          contenu_type: string
          created_at: string
          description: string | null
          id: string
          reporter_id: string
          status: string
          traite_at: string | null
          traite_par: string | null
        }
        Insert: {
          action_prise?: string | null
          categorie: string
          contenu_id: string
          contenu_type: string
          created_at?: string
          description?: string | null
          id?: string
          reporter_id: string
          status?: string
          traite_at?: string | null
          traite_par?: string | null
        }
        Update: {
          action_prise?: string | null
          categorie?: string
          contenu_id?: string
          contenu_type?: string
          created_at?: string
          description?: string | null
          id?: string
          reporter_id?: string
          status?: string
          traite_at?: string | null
          traite_par?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          app_version: string | null
          categorie: string
          created_at: string
          description: string
          device_model: string | null
          id: string
          last_screen: string | null
          os_version: string | null
          profile_id: string
          repondu_at: string | null
          reponse: string | null
          screenshot_url: string | null
          status: string
          sujet: string
        }
        Insert: {
          app_version?: string | null
          categorie: string
          created_at?: string
          description: string
          device_model?: string | null
          id?: string
          last_screen?: string | null
          os_version?: string | null
          profile_id: string
          repondu_at?: string | null
          reponse?: string | null
          screenshot_url?: string | null
          status?: string
          sujet: string
        }
        Update: {
          app_version?: string | null
          categorie?: string
          created_at?: string
          description?: string
          device_model?: string | null
          id?: string
          last_screen?: string | null
          os_version?: string | null
          profile_id?: string
          repondu_at?: string | null
          reponse?: string | null
          screenshot_url?: string | null
          status?: string
          sujet?: string
        }
        Relationships: []
      }
    }
    Views: {
      annonces_freshness_due: {
        Row: {
          date_fin: string | null
          freshness_reminder_count: number | null
          id: string | null
          profile_id: string | null
          statut: string | null
          ville: string | null
        }
        Insert: {
          date_fin?: string | null
          freshness_reminder_count?: number | null
          id?: string | null
          profile_id?: string | null
          statut?: string | null
          ville?: string | null
        }
        Update: {
          date_fin?: string | null
          freshness_reminder_count?: number | null
          id?: string | null
          profile_id?: string | null
          statut?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      profiles_cgu_outdated: {
        Row: {
          cgu_version: number | null
          current_version: number | null
          user_id: string | null
        }
        Insert: {
          cgu_version?: number | null
          current_version?: never
          user_id?: string | null
        }
        Update: {
          cgu_version?: number | null
          current_version?: never
          user_id?: string | null
        }
        Relationships: []
      }
      profiles_pending_reverify: {
        Row: {
          first_name: string | null
          id: string | null
          last_name: string | null
          rpps_cache_expires_at: string | null
          rpps_last_attempt_at: string | null
          rpps_number: string | null
          rpps_verification_status: string | null
          user_id: string | null
        }
        Insert: {
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          rpps_cache_expires_at?: string | null
          rpps_last_attempt_at?: string | null
          rpps_number?: string | null
          rpps_verification_status?: string | null
          user_id?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          rpps_cache_expires_at?: string | null
          rpps_last_attempt_at?: string | null
          rpps_number?: string | null
          rpps_verification_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cgu_accepted_at: string | null
          city: string | null
          created_at: string | null
          department: string | null
          first_name: string | null
          id: string | null
          is_blocked: boolean | null
          last_name: string | null
          launch_period_active: boolean | null
          mobility_radius_km: number | null
          profession_id: string | null
          rcp_verified: boolean | null
          region: string | null
          role: string | null
          rpps_number: string | null
          rpps_verified: boolean | null
          rpps_verified_at: string | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cgu_accepted_at?: string | null
          city?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string | null
          is_blocked?: boolean | null
          last_name?: string | null
          launch_period_active?: boolean | null
          mobility_radius_km?: number | null
          profession_id?: string | null
          rcp_verified?: boolean | null
          region?: string | null
          role?: string | null
          rpps_number?: string | null
          rpps_verified?: boolean | null
          rpps_verified_at?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cgu_accepted_at?: string | null
          city?: string | null
          created_at?: string | null
          department?: string | null
          first_name?: string | null
          id?: string | null
          is_blocked?: boolean | null
          last_name?: string | null
          launch_period_active?: boolean | null
          mobility_radius_km?: number | null
          profession_id?: string | null
          rcp_verified?: boolean | null
          region?: string | null
          role?: string | null
          rpps_number?: string | null
          rpps_verified?: boolean | null
          rpps_verified_at?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      annonces_similaires: {
        Args: { p_annonce_id: string; p_limit?: number }
        Returns: {
          date_debut: string
          date_fin: string
          distance_meters: number
          id: string
          is_urgent: boolean
          retrocession: number
          source: string
          statut: string
          type_annonce: string
          ville: string
        }[]
      }
      can_see_contact_info: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      check_message_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_max_requests: number
          p_window: string
        }
        Returns: boolean
      }
      check_search_rate_limit: { Args: { p_user_id: string }; Returns: boolean }
      cleanup_search_rate_limits: { Args: never; Returns: undefined }
      current_cgu_version: { Args: never; Returns: number }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      generate_parrainage_code: { Args: { p_user_id: string }; Returns: string }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_rate_limit_info: {
        Args: { p_endpoint: string; p_identifier: string }
        Returns: {
          current_count: number
          max_allowed: number
          window_reset: string
        }[]
      }
      get_retrocession_moyenne_zone: {
        Args: { lat: number; lon: number; radius_km?: number }
        Returns: number
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_verified_rpps: { Args: never; Returns: boolean }
      is_profile_owner: { Args: { check_user_id: string }; Returns: boolean }
      log_audit: {
        Args: {
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_resource_id?: string
          p_resource_type?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      match_remplacants_for_annonce: {
        Args: { p_annonce_id: string }
        Returns: {
          distance_meters: number
          fcm_token: string
          profile_id: string
          push_annonces: boolean
          user_id: string
        }[]
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_annonce_freshness: { Args: never; Returns: undefined }
      retrocession_moyenne_zone: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number }
        Returns: number
      }
      search_annonces_bbox: {
        Args: {
          p_limit?: number
          p_ne_lat: number
          p_ne_lng: number
          p_sw_lat: number
          p_sw_lng: number
        }
        Returns: {
          date_debut: string
          id: string
          is_urgent: boolean
          lat: number
          lng: number
          retrocession: number
          source: string
          statut: string
          ville: string
        }[]
      }
      search_annonces_geo: {
        Args: {
          p_date_debut?: string
          p_date_fin?: string
          p_lat: number
          p_limit?: number
          p_lng: number
          p_offset?: number
          p_radius_meters?: number
          p_retrocession_min?: number
        }
        Returns: {
          code_postal: string
          created_at: string
          date_debut: string
          date_fin: string
          description: string
          distance_meters: number
          id: string
          is_urgent: boolean
          profile_id: string
          retrocession: number
          source: string
          source_url: string
          specialites: Json
          statut: string
          type_annonce: string
          type_cabinet: string
          ville: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_score_fiabilite: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
    Enums: {},
  },
} as const
