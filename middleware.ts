import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !isLoggedIn) {
    // Redirect ke halaman login dengan query params callbackUrl
    const searchParams = new URLSearchParams();
    searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(new URL(`/login?${searchParams.toString()}`, req.nextUrl));
  }
});

export const config = {
  // Hanya jalankan middleware untuk rute dashboard
  matcher: ["/dashboard/:path*"],
};
