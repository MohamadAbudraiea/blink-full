import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageSquare, MessageCircle, Phone, Instagram } from "lucide-react";

export function HeroContactSection() {
  const { t } = useTranslation();

  const contacts = [
    {
      title: t("contact.info.phone.title"),
      value: "079 12 12 204",
      href: "tel:+962791212204",
      icon: Phone,
    },
    {
      title: t("contact.info.instagram.title"),
      value: "@blinkcar_",
      href: "https://www.instagram.com/blinkcar_?igsh=amQxZDBtazhhcXN3",
      icon: Instagram,
    },
    {
      title: t("contact.info.whatsapp.title"),
      value: "Chat on WhatsApp",
      href: "https://wa.me/962791212204",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-muted/30 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6"
          >
            <MessageSquare className="h-8 w-8 text-primary" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {t("contact.hero.title")}
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            {t("contact.hero.subtitle")}
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {contacts.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-card border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

                <p dir="ltr" className="text-muted-foreground text-sm">
                  {item.value}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
