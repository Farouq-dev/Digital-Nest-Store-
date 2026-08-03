import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I download my purchase?",
    a: "After payment you will receive an email with your download link instantly. You can also access all your purchases from your account dashboard.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards and PayPal.",
  },
  {
    q: "Do you offer refunds?",
    a: "Due to the digital nature of our products we do not offer refunds. However if you have an issue with your purchase contact us and we will help you.",
  },
  {
    q: "Can I use these products for commercial projects?",
    a: "Yes! All our templates and resources are licensed for personal and commercial use.",
  },
  {
    q: "Are the products beginner friendly?",
    a: "Absolutely. All our products are designed to be easy to use whether you are a beginner or a professional.",
  },
];

const FAQSection = () => (
  <section className="bg-background py-20">
    <div className="container max-w-3xl">
      <h2 className="font-display text-3xl font-bold text-foreground text-center mb-2">
        Frequently Asked <span className="text-accent glow-orange-text">Questions</span>
      </h2>
      <p className="text-muted-foreground text-center mb-12 font-body">Everything you need to know</p>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-accent/20 rounded-lg px-6 bg-card shadow-[0_0_15px_-3px_hsl(var(--accent)/0.15)]"
          >
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-accent [&[data-state=open]]:text-accent">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
