import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Faq } from "@/lib/types";

interface FaqSectionProps {
    faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <div className="container mx-auto px-4">

            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full rounded-xl">
                    {faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                            <AccordionTrigger className="text-left bg-gray-100 px-4 text-lg font-medium">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 text-muted-foreground pt-4 whitespace-pre-wrap">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
