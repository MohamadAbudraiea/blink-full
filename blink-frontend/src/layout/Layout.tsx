import HomeNavbar from "@/components/layout/homeNavbar";
import Footer from "@/components/layout/footer";
import { useCheckAuth } from "@/hooks/useAuth";
import UserNavbar from "@/components/layout/userNavbar";
import StaffNavbar from "@/components/layout/StaffNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isUser, isAdmin, isSecretary, isDetailer } = useCheckAuth();

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}
      {(isAdmin || isSecretary || isDetailer) && (
        <StaffNavbar role={user?.type} />
      )}
      {isUser && <UserNavbar />}
      {!isAdmin && !isSecretary && !isDetailer && !isUser && <HomeNavbar />}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
