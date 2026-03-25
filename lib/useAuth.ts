"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function useAuth(requiredRole?: "admin" | "doctor") {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {

    const checkAuth = async () => {

      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      // ❌ NOT LOGGED IN
      if (!currentUser) {
        router.push("/auth");
        return;
      }

      setUser(currentUser);

      // 🔹 GET ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      const userRole = profile?.role?.toLowerCase().trim() || null;

      setRole(userRole);

      // ❌ ROLE MISMATCH
      if (requiredRole && userRole !== requiredRole) {
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      setLoading(false);
    };

    checkAuth();

  }, [router, requiredRole]);

  return { user, role, loading };
}
