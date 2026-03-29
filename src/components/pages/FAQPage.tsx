import { HelpCircle } from "lucide-react@0.487.0";
import { faqs } from "@/data/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm text-primary shadow-sm">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-semibold text-slate-950">
            Got questions? We have answers.
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Everything you need to know about ISL Connect, gesture recognition, and getting started.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-2 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-slate-100 last:border-0">
                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-slate-900 hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-slate-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
