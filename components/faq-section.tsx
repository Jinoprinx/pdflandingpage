import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "Are these PDFs really free?",
      answer: "100% free – no trials, no credit card. We profit when you choose to upgrade later.",
    },
    {
      question: "Can I share these with my team?",
      answer: "Forward the email or tag us @AIprinx for bulk access.",
    },
    {
      question: "How do I get support?",
      answer: "Reply to your download email, and our AI experts will help.",
    },
    {
      question: "How often are the playbooks updated?",
      answer: "We update our playbooks quarterly to ensure you have the latest AI strategies and tools.",
    },
    {
      question: "Do you offer custom AI solutions?",
      answer: "Yes! After reviewing our playbooks, you can schedule a consultation for custom AI implementations personalised for your own business.",
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-[#F9F9F7]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[#C5A059] mb-3 tracking-wider uppercase">Got Questions?</p>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-[#1A1A1A]">
            Frequently Asked <span className="text-[#C5A059] italic">Questions</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-0">
                <AccordionTrigger className="text-left font-semibold text-[#1A1A1A] hover:text-[#C5A059] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
