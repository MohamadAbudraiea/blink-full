import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  User,
  Home,
  LayoutDashboard,
  Settings,
  Info,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { useCheckAuth, useLogout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useTheme } from "@/context/theme-provider";

export default function StaffNavbar({ role }: { role: string }) {
  const { user } = useCheckAuth();
  const { logoutMutation, isLoggingOut } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleLogout = () => {
    logoutMutation();
    setIsOpen(false);
  };

  const dashboardLink =
    role === "admin"
      ? "/blink-admin-dashboard"
      : role === "secretary"
      ? "/blink-secretary-dashboard"
      : role === "detailer"
      ? "/blink-detailer-dashboard"
      : "/";

  const profileLink = "/profile";

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    {
      path: dashboardLink,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { path: "/services", label: "Services", icon: Settings },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
              alt="BLINK Logo"
              className="h-25 w-auto"
            />
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Profile + Logout */}
          <div className="hidden md:flex items-center ml-4 space-x-2">
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm font-medium">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuItem asChild>
                  <Link
                    to={profileLink}
                    className="flex items-center gap-2 w-full"
                  >
                    <DropdownMenuSeparator />
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Sheet */}
          <div className="flex md:hidden items-center">
            <ThemeSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[85vw] max-w-sm p-0">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user && user.name}</span>
                      <span className="font-light text-sm">
                        {user && user.email}
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 px-6 overflow-y-auto">
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-foreground/80 hover:text-foreground hover:bg-accent transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    <Link
                      to={profileLink}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-foreground/80 hover:text-foreground hover:bg-accent transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </nav>
                </div>

                <div className="border-t p-6 mt-auto">
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    variant="destructive"
                    className="w-full justify-start gap-3 py-5 text-base"
                  >
                    <LogOut className="h-5 w-5" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
