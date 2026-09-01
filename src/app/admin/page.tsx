import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { ADMIN_COOKIE, adminPinConfigured, sessionValid } from "@/lib/admin-auth";
import { blobConfigured } from "@/lib/blob-gallery";
import AdminPinForm from "@/components/admin/AdminPinForm";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Glacier Air",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!adminPinConfigured()) {
    return (
      <div className="min-h-screen bg-[#060c1a] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <Image
            src="/glacier-air-logo.png"
            alt="Glacier Air"
            width={200}
            height={40}
            className="h-10 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-3">Admin is locked</h1>
          <p className="text-slate-300 leading-relaxed">
            Set <code className="text-[#c5e4f7]">ADMIN_PIN</code> on the Vercel preview project,
            then reload this page. The live glacierair.com.au site stays untouched.
          </p>
        </div>
      </div>
    );
  }

  const jar = await cookies();
  if (!sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return <AdminPinForm />;
  }

  return <AdminApp blobConfigured={blobConfigured()} />;
}
