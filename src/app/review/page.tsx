import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionValid } from "@/lib/admin-auth";
import AdminPinForm from "@/components/admin/AdminPinForm";
import ReviewOverlay from "@/components/review/ReviewOverlay";
import SiteHome from "@/components/SiteHome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Copy review | Glacier Air",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
  const jar = await cookies();
  if (!sessionValid(jar.get(ADMIN_COOKIE)?.value)) {
    return (
      <AdminPinForm
        title="Copy review"
        description="Same PIN as photo admin. After you sign in, click text on the live-looking site to leave a note."
      />
    );
  }

  return (
    <ReviewOverlay>
      <SiteHome />
    </ReviewOverlay>
  );
}
