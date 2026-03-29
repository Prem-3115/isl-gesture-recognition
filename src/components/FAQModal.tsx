import { HelpCircle } from "lucide-react@0.487.0";
import { faqs } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ScrollArea } from "./ui/scroll-area";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-hidden rounded-3xl p-0 sm:max-h-[85vh]">
        <div className="bg-slate-50 px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm text-primary shadow-sm">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <DialogTitle className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              Got questions? We have answers.
            </DialogTitle>
            <DialogDescription className="mt-2 text-base text-slate-500">
              Everything you need to know about ISL Connect, gesture recognition, and getting started.
            </DialogDescription>
          </div>

          <ScrollArea className="h-[50vh] w-full rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[45vh]">
            <div className="p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-slate-100 last:border-0">
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-900 hover:text-primary hover:no-underline [&[data-state=open]]:text-primary">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-6 text-slate-600">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
