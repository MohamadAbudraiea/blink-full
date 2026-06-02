import { useTheme } from "@/context/theme-provider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const services = [
    { name: t("home.services.items.wash.title"), href: "/services/wash" },
    {
      name: t("home.services.items.dryclean.title"),
      href: "/services/dryclean",
    },
    { name: t("home.services.items.polish.title"), href: "/services/polish" },
    {
      name: t("home.services.items.nano.title"),
      href: "/services/nano-ceramic",
    },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src={theme === "light" ? "/white-logo.png" : "/dark-logo.png"}
                alt="BLINK Logo"
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.tagline")}
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {t("footer.company")}.{" "}
              {t("footer.rights")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              {t("footer.services")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              {t("footer.company_info")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
