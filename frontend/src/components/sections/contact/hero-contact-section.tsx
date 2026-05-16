import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageCircle, Phone, Instagram } from "lucide-react";

export function HeroContactSection() {
  const { t } = useTranslation();

  const contacts = [
    {
      title: t("contact.info.phone.title"),
      value: "079 12 12 204",
      href: "tel:+962791212204",
      icon: Phone,
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
      borderColor: "hover:border-blue-500/50",
      iconColor: "text-blue-500",
    },
    {
      title: t("contact.info.whatsapp.title"),
      value: "WhatsApp",
      href: "https://wa.me/962791212204",
      icon: MessageCircle,
      glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]",
      borderColor: "hover:border-green-500/50",
      iconColor: "text-green-500",
    },
    {
      title: t("contact.info.instagram.title"),
      value: "Instagram",
      href: "https://www.instagram.com/blinkcar_?igsh=amQxZDBtazhhcXN3",
      icon: Instagram,
      glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]",
      borderColor: "hover:border-pink-500/50",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden flex flex-col items-center">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4">
            {t("contact.hero.subtitle")}
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto">
             {t("contact.hero.description")}
          </p>
        </motion.div>

        {/* Floating Contact Pills */}
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {contacts.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`group flex items-center gap-4 bg-muted/50 backdrop-blur-sm border border-border/50 px-8 py-4 rounded-full transition-all duration-500 ${item.borderColor} ${item.glow}`}
              >
                <div className={`p-2 rounded-full bg-background border border-border group-hover:scale-110 transition-transform duration-300 ${item.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
