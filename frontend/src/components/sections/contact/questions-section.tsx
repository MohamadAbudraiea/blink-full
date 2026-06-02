import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Calendar,
  Settings,
  CreditCard,
  HelpCircle,
} from "lucide-react";

function QuestionsSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    {
      id: "booking",
      label: t("contact.faq.categories.booking"),
      icon: Calendar,
    },
    {
      id: "services",
      label: t("contact.faq.categories.services"),
      icon: Settings,
    },
    {
      id: "pricing",
      label: t("contact.faq.categories.pricing"),
      icon: CreditCard,
    },
    {
      id: "general",
      label: t("contact.faq.categories.general"),
      icon: HelpCircle,
    },
  ];

  const questions = [
    {
      id: "q1",
      icon: Settings,
      category: "services",
    },
    {
      id: "q2",
      icon: Calendar,
      category: "booking",
    },
    {
      id: "q3",
      icon: CreditCard,
      category: "pricing",
    },
    {
      id: "q4",
      icon: HelpCircle,
      category: "general",
    },
  ];

  const filteredQuestions =
    activeCategory === "all"
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-16"
        >
          <h2 className="font-nativera text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            {t("contact.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.faq.description")}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all duration-300 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-primary"}`}
                />
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
                  openIndex === idx
                    ? "bg-background border-primary shadow-xl shadow-primary/5"
                    : "bg-muted/30 border-border/50 hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl transition-colors duration-300 ${
                        openIndex === idx
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-primary group-hover:bg-primary/10"
                      }`}
                    >
                      <q.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-lg font-bold transition-colors ${openIndex === idx ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                    >
                      {t(`contact.faq.questions.${q.id}.question`)}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-transform duration-300 ${openIndex === idx ? "rotate-180 bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 pt-2 ml-14">
                        <p className="text-muted-foreground leading-relaxed text-lg border-l-2 border-primary/20 pl-6">
                          {t(`contact.faq.questions.${q.id}.answer`)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No questions found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default QuestionsSection;
