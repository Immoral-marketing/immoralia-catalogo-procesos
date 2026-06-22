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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          emoji: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          emoji?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          assistant_messages_count: number | null
          company_name: string | null
          company_sector: string | null
          company_size_hint: string | null
          conversation_text: string | null
          created_at: string | null
          ended_reason: string | null
          feedback_comment: string | null
          first_question: string | null
          form_opened: boolean | null
          form_submitted: boolean | null
          human_intervention_required: boolean | null
          id: string
          location_hint: string | null
          resolved: boolean | null
          total_turns: number | null
          user_feedback: string | null
          user_messages_count: number | null
        }
        Insert: {
          assistant_messages_count?: number | null
          company_name?: string | null
          company_sector?: string | null
          company_size_hint?: string | null
          conversation_text?: string | null
          created_at?: string | null
          ended_reason?: string | null
          feedback_comment?: string | null
          first_question?: string | null
          form_opened?: boolean | null
          form_submitted?: boolean | null
          human_intervention_required?: boolean | null
          id?: string
          location_hint?: string | null
          resolved?: boolean | null
          total_turns?: number | null
          user_feedback?: string | null
          user_messages_count?: number | null
        }
        Update: {
          assistant_messages_count?: number | null
          company_name?: string | null
          company_sector?: string | null
          company_size_hint?: string | null
          conversation_text?: string | null
          created_at?: string | null
          ended_reason?: string | null
          feedback_comment?: string | null
          first_question?: string | null
          form_opened?: boolean | null
          form_submitted?: boolean | null
          human_intervention_required?: boolean | null
          id?: string
          location_hint?: string | null
          resolved?: boolean | null
          total_turns?: number | null
          user_feedback?: string | null
          user_messages_count?: number | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          assistant_message_count: number
          call_scheduled: boolean
          created_at: string
          human_requested: boolean
          id: string
          initial_route: string | null
          initial_sector: string | null
          last_activity_at: string
          lead_captured: boolean
          lead_form_dismissed: boolean
          lead_form_offered: boolean
          lead_id: string | null
          status: string
          structured_summary: Json | null
          summary: string | null
          summary_message_count: number
          surface: string | null
          user_message_count: number
        }
        Insert: {
          assistant_message_count?: number
          call_scheduled?: boolean
          created_at?: string
          human_requested?: boolean
          id?: string
          initial_route?: string | null
          initial_sector?: string | null
          last_activity_at?: string
          lead_captured?: boolean
          lead_form_dismissed?: boolean
          lead_form_offered?: boolean
          lead_id?: string | null
          status?: string
          structured_summary?: Json | null
          summary?: string | null
          summary_message_count?: number
          surface?: string | null
          user_message_count?: number
        }
        Update: {
          assistant_message_count?: number
          call_scheduled?: boolean
          created_at?: string
          human_requested?: boolean
          id?: string
          initial_route?: string | null
          initial_sector?: string | null
          last_activity_at?: string
          lead_captured?: boolean
          lead_form_dismissed?: boolean
          lead_form_offered?: boolean
          lead_id?: string | null
          status?: string
          structured_summary?: Json | null
          summary?: string | null
          summary_message_count?: number
          surface?: string | null
          user_message_count?: number
        }
        Relationships: []
      }
      chatbot_knowledge: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      chatbot_message_ratings: {
        Row: {
          conversation_id: string
          created_at: string
          message_id: string
          rating: string
          updated_at: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          message_id: string
          rating: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          message_id?: string
          rating?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_message_ratings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_message_ratings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: true
            referencedRelation: "chatbot_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          ip_hash: string | null
          is_error: boolean
          recommended_slugs: string[]
          role: string
          route: string | null
          sector: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          is_error?: boolean
          recommended_slugs?: string[]
          role: string
          route?: string | null
          sector?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          is_error?: boolean
          recommended_slugs?: string[]
          role?: string
          route?: string | null
          sector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      comisiones: {
        Row: {
          created_at: string
          estado: string
          factura_url: string | null
          id: string
          importe_base: number
          importe_comision: number
          pagada_at: string | null
          partner_id: string
          porcentaje: number
          solicitud_id: string
        }
        Insert: {
          created_at?: string
          estado?: string
          factura_url?: string | null
          id?: string
          importe_base: number
          importe_comision: number
          pagada_at?: string | null
          partner_id: string
          porcentaje?: number
          solicitud_id: string
        }
        Update: {
          created_at?: string
          estado?: string
          factura_url?: string | null
          id?: string
          importe_base?: number
          importe_comision?: number
          pagada_at?: string | null
          partner_id?: string
          porcentaje?: number
          solicitud_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comisiones_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comisiones_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests_log: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip_address: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          clickup_task_id: string | null
          comentario: string | null
          created_at: string | null
          email: string
          empresa: string
          id: string
          interested_process_slugs: string[] | null
          ip_address: string | null
          nombre: string
          onboarding_answers: Json | null
          primary_interested_slug: string | null
          selected_processes: Json | null
        }
        Insert: {
          clickup_task_id?: string | null
          comentario?: string | null
          created_at?: string | null
          email: string
          empresa: string
          id?: string
          interested_process_slugs?: string[] | null
          ip_address?: string | null
          nombre: string
          onboarding_answers?: Json | null
          primary_interested_slug?: string | null
          selected_processes?: Json | null
        }
        Update: {
          clickup_task_id?: string | null
          comentario?: string | null
          created_at?: string | null
          email?: string
          empresa?: string
          id?: string
          interested_process_slugs?: string[] | null
          ip_address?: string | null
          nombre?: string
          onboarding_answers?: Json | null
          primary_interested_slug?: string | null
          selected_processes?: Json | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          conversation_id: string | null
          created_at: string
          error_message: string | null
          id: string
          kind: string
          lead_id: string | null
          metadata: Json | null
          recipient: string
          resend_id: string | null
          status: string
          subject: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          kind: string
          lead_id?: string | null
          metadata?: Json | null
          recipient: string
          resend_id?: string | null
          status: string
          subject?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
          metadata?: Json | null
          recipient?: string
          resend_id?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      onboarding_leads: {
        Row: {
          answers: Json
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          nombre: string
          telefono: string | null
        }
        Insert: {
          answers: Json
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          nombre: string
          telefono?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          activo: boolean
          created_at: string
          email: string
          id: string
          nombre: string
          slug: string
          user_id: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          email: string
          id?: string
          nombre: string
          slug: string
          user_id?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          slug?: string
          user_id?: string | null
        }
        Relationships: []
      }
      processes: {
        Row: {
          bloque_negocio: string | null
          canales: string[] | null
          catalog_active: boolean
          codigo: string
          created_at: string | null
          descripcion_detallada: string | null
          dolores: string[] | null
          guion_clickup_url: string | null
          guion_generado: boolean | null
          guion_generado_at: string | null
          herramientas: string[] | null
          id: string
          image_subtitle_1: string | null
          image_subtitle_2: string | null
          image_subtitle_3: string | null
          image_url_1: string | null
          image_url_2: string | null
          image_url_3: string | null
          imagenes_generadas: boolean | null
          imagenes_generadas_at: string | null
          integration_domains: string[] | null
          landing_slug: string | null
          modulo_codigo: string | null
          nombre: string
          pasos: Json | null
          personalizacion: string | null
          recomendado: boolean | null
          sectores: string[] | null
          slug: string | null
          tagline: string | null
          video_generado: boolean
          video_generado_at: string | null
          video_remotion_url: string | null
        }
        Insert: {
          bloque_negocio?: string | null
          canales?: string[] | null
          catalog_active?: boolean
          codigo: string
          created_at?: string | null
          descripcion_detallada?: string | null
          dolores?: string[] | null
          guion_clickup_url?: string | null
          guion_generado?: boolean | null
          guion_generado_at?: string | null
          herramientas?: string[] | null
          id: string
          image_subtitle_1?: string | null
          image_subtitle_2?: string | null
          image_subtitle_3?: string | null
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          imagenes_generadas?: boolean | null
          imagenes_generadas_at?: string | null
          integration_domains?: string[] | null
          landing_slug?: string | null
          modulo_codigo?: string | null
          nombre: string
          pasos?: Json | null
          personalizacion?: string | null
          recomendado?: boolean | null
          sectores?: string[] | null
          slug?: string | null
          tagline?: string | null
          video_generado?: boolean
          video_generado_at?: string | null
          video_remotion_url?: string | null
        }
        Update: {
          bloque_negocio?: string | null
          canales?: string[] | null
          catalog_active?: boolean
          codigo?: string
          created_at?: string | null
          descripcion_detallada?: string | null
          dolores?: string[] | null
          guion_clickup_url?: string | null
          guion_generado?: boolean | null
          guion_generado_at?: string | null
          herramientas?: string[] | null
          id?: string
          image_subtitle_1?: string | null
          image_subtitle_2?: string | null
          image_subtitle_3?: string | null
          image_url_1?: string | null
          image_url_2?: string | null
          image_url_3?: string | null
          imagenes_generadas?: boolean | null
          imagenes_generadas_at?: string | null
          integration_domains?: string[] | null
          landing_slug?: string | null
          modulo_codigo?: string | null
          nombre?: string
          pasos?: Json | null
          personalizacion?: string | null
          recomendado?: boolean | null
          sectores?: string[] | null
          slug?: string | null
          tagline?: string | null
          video_generado?: boolean
          video_generado_at?: string | null
          video_remotion_url?: string | null
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          partner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          partner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      slack_notifications_log: {
        Row: {
          clickup_task_id: string
          created_at: string | null
          error_message: string | null
          success: boolean | null
        }
        Insert: {
          clickup_task_id: string
          created_at?: string | null
          error_message?: string | null
          success?: boolean | null
        }
        Update: {
          clickup_task_id?: string
          created_at?: string | null
          error_message?: string | null
          success?: boolean | null
        }
        Relationships: []
      }
      solicitudes: {
        Row: {
          created_at: string
          datos_formulario: Json
          estado: string
          id: string
          importe_cobrado: number | null
          override_manual: boolean
          partner_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          datos_formulario?: Json
          estado?: string
          id?: string
          importe_cobrado?: number | null
          override_manual?: boolean
          partner_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          datos_formulario?: Json
          estado?: string
          id?: string
          importe_cobrado?: number | null
          override_manual?: boolean
          partner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string
          email: string
          nombre: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          nombre: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          nombre?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_partner_id_by_slug: { Args: { p_slug: string }; Returns: string }
      is_super_admin: { Args: never; Returns: boolean }
      match_chatbot_knowledge:
        | {
            Args: {
              match_count: number
              match_threshold: number
              query_embedding: string
            }
            Returns: {
              content: string
              id: string
              metadata: Json
              similarity: number
            }[]
          }
        | {
            Args: {
              match_count: number
              match_threshold: number
              query_embedding: string
              sector_filter?: string
            }
            Returns: {
              content: string
              id: string
              metadata: Json
              similarity: number
            }[]
          }
      set_comision_factura_url: {
        Args: { p_comision_id: string; p_factura_url: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
