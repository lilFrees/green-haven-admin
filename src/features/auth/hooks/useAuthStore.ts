import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../../../shared/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  setSession: (session: Session) => void;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      user: null,
      session: null,

      setSession: (session) => {
        set({ session, user: session?.user ?? null });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: async () => {
        await supabase.auth.signOut({
          scope: "global",
        });
        set({ session: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
