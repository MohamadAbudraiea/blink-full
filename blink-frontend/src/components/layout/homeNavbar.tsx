import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  Settings,
  Info,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/theme-provider";

export default function HomeNavbar() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/services", label: t("nav.services"), icon: Settings },
    { path: "/about", label: t("nav.about"), icon: Info },
    { path: "/contact", label: t("nav.contact"), icon: Phone },
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

          {/* Desktop Nav Links */}
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

            {/* Desktop Login / Signup */}
            <div
              className={`hidden md:flex items-center ml-4 ${
                isRTL ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t("nav.login")}
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t("nav.signup")}
                </Link>
              </Button>
            </div>

            {/* Mobile Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-[85vw] max-w-sm p-0"
              >
                <SheetHeader></SheetHeader>
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

                    {/* Login / Signup */}
                    <div className="flex flex-col space-y-3 pt-4 border-t mt-4">
                      <Button variant="ghost" asChild className="justify-start">
                        <Link
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2"
                        >
                          <LogIn className="h-5 w-5" />
                          {t("nav.login")}
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 justify-start"
                      >
                        <Link
                          to="/signup"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="h-5 w-5" />
                          {t("nav.signup")}
                        </Link>
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
