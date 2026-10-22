import { isAdmin } from "@/lib/auth";
import { AdminPanel, AdminLogin } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};
export default async function Page() {
  return (await isAdmin()) ? (
    <AdminPanel />
  ) : (
    <AdminLogin
      configured={
        !!process.env.ADMIN_PASSWORD && !!process.env.ADMIN_SESSION_SECRET
      }
    />
  );
}
