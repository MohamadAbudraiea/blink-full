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
  Settings,
  Info,
  Phone,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLogout, useCheckAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function UserNavbar() {
  const { user } = useCheckAuth();
  const { logoutMutation, isLoggingOut } = useLogout();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  const handleLogout = () => {
    logoutMutation();
    setIsOpen(false);
  };

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/services", label: t("nav.services"), icon: Settings },
    { path: "/about", label: t("nav.about"), icon: Info },
    { path: "/contact", label: t("nav.contact"), icon: Phone },
    { path: "/my-bookings", label: t("nav.my_bookings"), icon: CalendarDays },
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  <item.icon className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeSwitcher />

            {/* Desktop Profile + Logout */}
            {user && (
              <div className="hidden md:flex items-center ml-4">
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
                        to="/profile"
                        className="flex items-center gap-2 w-full"
                      >
                        <User className="h-4 w-4" />
                        {t("nav.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoggingOut ? t("nav.logging_out") : t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Sheet */}
            <div className="flex md:hidden items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isRTL ? "left" : "right"}
                  className="w-[85vw] max-w-sm p-0"
                >
                  <SheetHeader>
                    <SheetTitle
                      className={`flex items-center ${
                        isRTL ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{user && user.name}</span>
                        <span className="font-light text-sm">
                          {user && user.email}
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 px-6 overflow-y-auto">
                    <nav className="space-y-2 mt-6">
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

                      {/* Profile */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-foreground/80 hover:text-foreground hover:bg-accent transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">{t("nav.profile")}</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Logout at bottom */}
                  <div className="border-t p-6 mt-auto">
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      variant="destructive"
                      className="w-full justify-start gap-3 py-5 text-base"
                    >
                      <LogOut className="h-5 w-5" />
                      {isLoggingOut ? t("nav.logging_out") : t("nav.logout")}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
