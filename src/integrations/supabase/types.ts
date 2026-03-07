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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      AdminUsers: {
        Row: {
          created_at: string
          email: string
          id: string
          isSigner: boolean | null
          password: string | null
          privy_id: string | null
          quorumId: string | null
          role: Database["public"]["Enums"]["AdminRole"]
          wallet: string | null
          walletId: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          isSigner?: boolean | null
          password?: string | null
          privy_id?: string | null
          quorumId?: string | null
          role?: Database["public"]["Enums"]["AdminRole"]
          wallet?: string | null
          walletId?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          isSigner?: boolean | null
          password?: string | null
          privy_id?: string | null
          quorumId?: string | null
          role?: Database["public"]["Enums"]["AdminRole"]
          wallet?: string | null
          walletId?: string | null
        }
        Relationships: []
      }
      AdminWallet: {
        Row: {
          address: string
          created_at: string
          id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      Contract_token: {
        Row: {
          created_at: string
          id: string
          item_id: string
          locker_id: string
          nftAddress: string | null
          token_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          locker_id: string
          nftAddress?: string | null
          token_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          locker_id?: string
          nftAddress?: string | null
          token_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Contract_token_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contract_token_locker_id_fkey"
            columns: ["locker_id"]
            isOneToOne: false
            referencedRelation: "Locker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contract_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Contracts: {
        Row: {
          admin_id: string | null
          contract_address: string
          created_at: string
          id: string
          type: Database["public"]["Enums"]["ContractUserType"]
          updated_at: string
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          admin_id?: string | null
          contract_address: string
          created_at?: string
          id?: string
          type: Database["public"]["Enums"]["ContractUserType"]
          updated_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          admin_id?: string | null
          contract_address?: string
          created_at?: string
          id?: string
          type?: Database["public"]["Enums"]["ContractUserType"]
          updated_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Contracts_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "AdminUsers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Level: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          level: number
          max_xp: number | null
          min_xp: number
          name: string
          updatedAt: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          level: number
          max_xp?: number | null
          min_xp: number
          name: string
          updatedAt?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          level?: number
          max_xp?: number | null
          min_xp?: number
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Locker: {
        Row: {
          bestSellPrice: number | null
          change_type: string | null
          coin_change: number | null
          coins: number
          created_at: string
          id: string
          is_sell_item: boolean
          item_id: string
          listed_at: string | null
          listed_for_sale: boolean
          listed_quantity: number | null
          nftBuyerWalletId: string | null
          purchase_date: string
          quantity: number | null
          resale_status: string | null
          sale_end_date: string | null
          sale_price: number | null
          sell_at: string | null
          sell_count: number
          status: string | null
          token_ids: string[] | null
          total_purchased_locker_item: number
          user_id: string
        }
        Insert: {
          bestSellPrice?: number | null
          change_type?: string | null
          coin_change?: number | null
          coins: number
          created_at?: string
          id?: string
          is_sell_item?: boolean
          item_id: string
          listed_at?: string | null
          listed_for_sale?: boolean
          listed_quantity?: number | null
          nftBuyerWalletId?: string | null
          purchase_date?: string
          quantity?: number | null
          resale_status?: string | null
          sale_end_date?: string | null
          sale_price?: number | null
          sell_at?: string | null
          sell_count?: number
          status?: string | null
          token_ids?: string[] | null
          total_purchased_locker_item?: number
          user_id: string
        }
        Update: {
          bestSellPrice?: number | null
          change_type?: string | null
          coin_change?: number | null
          coins?: number
          created_at?: string
          id?: string
          is_sell_item?: boolean
          item_id?: string
          listed_at?: string | null
          listed_for_sale?: boolean
          listed_quantity?: number | null
          nftBuyerWalletId?: string | null
          purchase_date?: string
          quantity?: number | null
          resale_status?: string | null
          sale_end_date?: string | null
          sale_price?: number | null
          sell_at?: string | null
          sell_count?: number
          status?: string | null
          token_ids?: string[] | null
          total_purchased_locker_item?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Locker_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Locker_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_bids: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          bid_amount: number
          bidder_id: string
          created_at: string
          expires_at: string
          id: string
          item_id: string
          locker_id: string
          status: string
          token_id: number | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          bid_amount: number
          bidder_id: string
          created_at?: string
          expires_at?: string
          id?: string
          item_id: string
          locker_id: string
          status?: string
          token_id?: number | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          bid_amount?: number
          bidder_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          item_id?: string
          locker_id?: string
          status?: string
          token_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nft_bids_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_bids_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_bids_locker_id_fkey"
            columns: ["locker_id"]
            isOneToOne: false
            referencedRelation: "Locker"
            referencedColumns: ["id"]
          },
        ]
      }
      Notification: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          related_id: string | null
          related_type: Database["public"]["Enums"]["NotificationRelated"]
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_id?: string | null
          related_type: Database["public"]["Enums"]["NotificationRelated"]
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          related_id?: string | null
          related_type?: Database["public"]["Enums"]["NotificationRelated"]
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Objective: {
        Row: {
          category: Database["public"]["Enums"]["ObjectiveCategory"]
          created_at: string
          description: string | null
          icon: string | null
          id: string
          isActive: boolean
          rewardXP: number
          targetCount: number
          title: string
          type: Database["public"]["Enums"]["ObjectiveType"]
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["ObjectiveCategory"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          isActive?: boolean
          rewardXP: number
          targetCount: number
          title: string
          type: Database["public"]["Enums"]["ObjectiveType"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["ObjectiveCategory"]
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          isActive?: boolean
          rewardXP?: number
          targetCount?: number
          title?: string
          type?: Database["public"]["Enums"]["ObjectiveType"]
          updated_at?: string
        }
        Relationships: []
      }
      ObjectiveProgress: {
        Row: {
          category: Database["public"]["Enums"]["ObjectiveCategory"]
          completed: boolean
          currentCount: number
          endDate: string | null
          id: string
          lastUpdated: string
          objective_id: string
          startDate: string
          type: Database["public"]["Enums"]["ObjectiveType"]
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["ObjectiveCategory"]
          completed?: boolean
          currentCount?: number
          endDate?: string | null
          id?: string
          lastUpdated?: string
          objective_id: string
          startDate?: string
          type: Database["public"]["Enums"]["ObjectiveType"]
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["ObjectiveCategory"]
          completed?: boolean
          currentCount?: number
          endDate?: string | null
          id?: string
          lastUpdated?: string
          objective_id?: string
          startDate?: string
          type?: Database["public"]["Enums"]["ObjectiveType"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ObjectiveProgress_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "Objective"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ObjectiveProgress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Performances: {
        Row: {
          created_at: string
          id: string
          level: number | null
          level_id: string | null
          ranking: string | null
          total_XP: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number | null
          level_id?: string | null
          ranking?: string | null
          total_XP?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          level_id?: string | null
          ranking?: string | null
          total_XP?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Performances_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "Level"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Performances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_interests: {
        Row: {
          contact: string
          created_at: string
          entry_size: string
          id: string
          name: string
          wallet: string
        }
        Insert: {
          contact: string
          created_at?: string
          entry_size: string
          id?: string
          name: string
          wallet: string
        }
        Update: {
          contact?: string
          created_at?: string
          entry_size?: string
          id?: string
          name?: string
          wallet?: string
        }
        Relationships: []
      }
      store_items: {
        Row: {
          baseURI: string | null
          category: string
          created_at: string
          deploymentTxHash: string | null
          description: string | null
          first_release_date: string
          gatewayUrl: string | null
          id: string
          image_url: string
          ImgGatewayUrl: string | null
          ipfsHash: string | null
          is_active: boolean
          local_folder_url: string | null
          max_supply: number
          mintingTxHash: string | null
          name: string
          nftAddress: string | null
          nftDeployWalletId: string | null
          price: number
          rarity: string
          sale_end_date: string | null
          sale_start_date: string | null
          total_purchased: number
          updated_at: string
          userAddress: string | null
        }
        Insert: {
          baseURI?: string | null
          category: string
          created_at?: string
          deploymentTxHash?: string | null
          description?: string | null
          first_release_date: string
          gatewayUrl?: string | null
          id?: string
          image_url: string
          ImgGatewayUrl?: string | null
          ipfsHash?: string | null
          is_active?: boolean
          local_folder_url?: string | null
          max_supply?: number
          mintingTxHash?: string | null
          name: string
          nftAddress?: string | null
          nftDeployWalletId?: string | null
          price: number
          rarity: string
          sale_end_date?: string | null
          sale_start_date?: string | null
          total_purchased?: number
          updated_at?: string
          userAddress?: string | null
        }
        Update: {
          baseURI?: string | null
          category?: string
          created_at?: string
          deploymentTxHash?: string | null
          description?: string | null
          first_release_date?: string
          gatewayUrl?: string | null
          id?: string
          image_url?: string
          ImgGatewayUrl?: string | null
          ipfsHash?: string | null
          is_active?: boolean
          local_folder_url?: string | null
          max_supply?: number
          mintingTxHash?: string | null
          name?: string
          nftAddress?: string | null
          nftDeployWalletId?: string | null
          price?: number
          rarity?: string
          sale_end_date?: string | null
          sale_start_date?: string | null
          total_purchased?: number
          updated_at?: string
          userAddress?: string | null
        }
        Relationships: []
      }
      Transactions: {
        Row: {
          amount: number
          coins: number
          createdAt: string
          cryptoAmount: number | null
          depositAddress: string | null
          description: string | null
          exchangeRate: number | null
          id: string
          item_id: string | null
          locker_id: string | null
          nftBuyerWalletId: string | null
          payment_intent: string | null
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          sessionId: string | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          txHash: string | null
          updatedAt: string
          user_id: string
          userIp: string | null
          xp: number | null
        }
        Insert: {
          amount: number
          coins: number
          createdAt?: string
          cryptoAmount?: number | null
          depositAddress?: string | null
          description?: string | null
          exchangeRate?: number | null
          id?: string
          item_id?: string | null
          locker_id?: string | null
          nftBuyerWalletId?: string | null
          payment_intent?: string | null
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          sessionId?: string | null
          status: Database["public"]["Enums"]["TransactionStatus"]
          txHash?: string | null
          updatedAt?: string
          user_id: string
          userIp?: string | null
          xp?: number | null
        }
        Update: {
          amount?: number
          coins?: number
          createdAt?: string
          cryptoAmount?: number | null
          depositAddress?: string | null
          description?: string | null
          exchangeRate?: number | null
          id?: string
          item_id?: string | null
          locker_id?: string | null
          nftBuyerWalletId?: string | null
          payment_intent?: string | null
          paymentMethod?: Database["public"]["Enums"]["PaymentMethod"]
          sessionId?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
          txHash?: string | null
          updatedAt?: string
          user_id?: string
          userIp?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_locker_id_fkey"
            columns: ["locker_id"]
            isOneToOne: false
            referencedRelation: "Locker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          coins: number | null
          created_at: string
          email: string | null
          id: string
          isSigner: boolean | null
          name: string
          password: string | null
          privy_id: string | null
          profileImage: string | null
          quorumId: string | null
          ref_by: string | null
          ref_by_code: string | null
          ref_code: string | null
          updated_at: string
          wallet_address: string | null
          xp: number | null
        }
        Insert: {
          coins?: number | null
          created_at?: string
          email?: string | null
          id?: string
          isSigner?: boolean | null
          name: string
          password?: string | null
          privy_id?: string | null
          profileImage?: string | null
          quorumId?: string | null
          ref_by?: string | null
          ref_by_code?: string | null
          ref_code?: string | null
          updated_at?: string
          wallet_address?: string | null
          xp?: number | null
        }
        Update: {
          coins?: number | null
          created_at?: string
          email?: string | null
          id?: string
          isSigner?: boolean | null
          name?: string
          password?: string | null
          privy_id?: string | null
          profileImage?: string | null
          quorumId?: string | null
          ref_by?: string | null
          ref_by_code?: string | null
          ref_code?: string | null
          updated_at?: string
          wallet_address?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_ref_by_fkey"
            columns: ["ref_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_coins_atomic: {
        Args: { p_amount: number; p_user_id: string; p_xp_gain?: number }
        Returns: {
          new_coins: number
          new_xp: number
        }[]
      }
      deduct_coins_atomic: {
        Args: { p_amount: number; p_user_id: string; p_xp_gain?: number }
        Returns: {
          new_coins: number
          new_xp: number
        }[]
      }
      expire_stale_bids: { Args: never; Returns: undefined }
    }
    Enums: {
      AdminRole: "admin" | "sub_admin"
      ContractUserType: "admin" | "customer"
      NotificationRelated:
        | "store_item"
        | "locker_item"
        | "transaction"
        | "performance"
        | "objective"
        | "user"
        | "none"
      NotificationType:
        | "store_purchase"
        | "performance_update"
        | "objective_complete"
        | "xp_increase"
        | "marketplace_purchase"
        | "marketplace_sale"
        | "bid_placed"
        | "bid_accepted"
        | "bid_outbid"
        | "bid_expired"
        | "bid_rejected"
      ObjectiveCategory: "daily" | "weekly"
      ObjectiveType:
        | "packs"
        | "fighters"
        | "invitation"
        | "game"
        | "trade"
        | "sell"
        | "win"
        | "friend"
      PaymentMethod: "crypto" | "card" | "coin"
      TransactionStatus: "pending" | "success" | "failed"
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
      AdminRole: ["admin", "sub_admin"],
      ContractUserType: ["admin", "customer"],
      NotificationRelated: [
        "store_item",
        "locker_item",
        "transaction",
        "performance",
        "objective",
        "user",
        "none",
      ],
      NotificationType: [
        "store_purchase",
        "performance_update",
        "objective_complete",
        "xp_increase",
        "marketplace_purchase",
        "marketplace_sale",
        "bid_placed",
        "bid_accepted",
        "bid_outbid",
        "bid_expired",
        "bid_rejected",
      ],
      ObjectiveCategory: ["daily", "weekly"],
      ObjectiveType: [
        "packs",
        "fighters",
        "invitation",
        "game",
        "trade",
        "sell",
        "win",
        "friend",
      ],
      PaymentMethod: ["crypto", "card", "coin"],
      TransactionStatus: ["pending", "success", "failed"],
    },
  },
} as const
