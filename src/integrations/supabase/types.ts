export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          email: string | null
          final_mood: string
          id: string
          language_code: string | null
          life_satisfaction_score: number | null
          mental_status: string | null
          name: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood: string
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood?: string
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results_en: {
        Row: {
          answers: Json
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          email: string | null
          final_mood: string
          id: string
          life_satisfaction_score: number | null
          mental_status: string | null
          name: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood?: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results_new: {
        Row: {
          answers: Json | null
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          final_mood: string | null
          id: string
          language_code: string | null
          life_satisfaction_score: number | null
          mental_status: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          final_mood?: string | null
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          final_mood?: string | null
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results_unified: {
        Row: {
          answers: Json
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          email: string | null
          final_mood: string
          id: string
          language_code: string | null
          life_satisfaction_score: number | null
          mental_status: string | null
          name: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood: string
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood?: string
          id?: string
          language_code?: string | null
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results_zh_cn: {
        Row: {
          answers: Json
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          email: string | null
          final_mood: string
          id: string
          life_satisfaction_score: number | null
          mental_status: string | null
          name: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood?: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_results_zh_hk: {
        Row: {
          answers: Json
          anxiety_score: number | null
          created_at: string
          depression_score: number | null
          email: string | null
          final_mood: string
          id: string
          life_satisfaction_score: number | null
          mental_status: string | null
          name: string | null
          stress_score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          anxiety_score?: number | null
          created_at?: string
          depression_score?: number | null
          email?: string | null
          final_mood?: string
          id?: string
          life_satisfaction_score?: number | null
          mental_status?: string | null
          name?: string | null
          stress_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          anxiety: number
          depression: number
          ican_email: string
          ican_id: string
          id: string
          language: string
          life_satisfaction: number
          stress: number
          taken_at: string
        }
        Insert: {
          anxiety: number
          depression: number
          ican_email: string
          ican_id: string
          id?: string
          language: string
          life_satisfaction: number
          stress: number
          taken_at?: string
        }
        Update: {
          anxiety?: number
          depression?: number
          ican_email?: string
          ican_id?: string
          id?: string
          language?: string
          life_satisfaction?: number
          stress?: number
          taken_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
