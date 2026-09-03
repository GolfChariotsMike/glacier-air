import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import { supabaseConfigured } from "@/lib/supabase-gallery";
import AdminPinForm from "@/components/admin/AdminPinForm";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Glacier Air",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jar = await cookies();
  if (sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminApp supabaseConfigured={supabaseConfigured()} />;
  }
  return <AdminPinForm />;
}
