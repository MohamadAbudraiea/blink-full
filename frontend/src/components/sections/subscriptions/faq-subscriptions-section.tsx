import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div data-aos="fade-up" data-aos-delay={index * 80}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 text-left cursor-pointer group"
      >
        <span className="text-base font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">
          {question}
        </span>
        <div
          className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 py-4 text-muted-foreground text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSubscriptionsSection() {
  const { t } = useTranslation();

  const faqs = [
    {
      questionKey: "subscriptionsPage.faq.items.q1.question",
      answerKey: "subscriptionsPage.faq.items.q1.answer",
    },
    {
      questionKey: "subscriptionsPage.faq.items.q2.question",
      answerKey: "subscriptionsPage.faq.items.q2.answer",
    },
    {
      questionKey: "subscriptionsPage.faq.items.q3.question",
      answerKey: "subscriptionsPage.faq.items.q3.answer",
    },
    {
      questionKey: "subscriptionsPage.faq.items.q4.question",
      answerKey: "subscriptionsPage.faq.items.q4.answer",
    },
    {
      questionKey: "subscriptionsPage.faq.items.q5.question",
      answerKey: "subscriptionsPage.faq.items.q5.answer",
    },
    {
      questionKey: "subscriptionsPage.faq.items.q6.question",
      answerKey: "subscriptionsPage.faq.items.q6.answer",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="text-center mb-16"
        >
          <h2 className="font-nativera text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 tracking-tighter uppercase italic">
            {t("subscriptionsPage.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {t("subscriptionsPage.faq.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={t(faq.questionKey)}
              answer={t(faq.answerKey)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
