"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/component/ui/accordian";

export default function FAQSection() {
  const faqs = [
    {
      question: "Can I reschedule or cancel my appointment?",
      answer:
        " Yes, you can easily reschedule or cancel your appointment through the 'My Appointments' section. Just select the appointment and choose the option to reschedule or cancel.",
    },
    {
      question: "Is there a fee for booking an appointment through HospitEase?",
      answer:
        "The booking process on HospitEase is free of charge. However, the consultation fee depends on the hospital or doctor you choose, and it will be clearly mentioned during the booking process.",
    },
    {
      question: "How can I check the status of my appointment?",
      answer:
        "You can view the status of your appointment by logging in to your account and navigating to the 'My Appointments' section. You will also receive updates via SMS or email notifications.",
    },
    {
      question: "What happens if I miss my appointment?",
      answer:
        "If you miss your appointment, you can either reschedule it for a later time or book a new one. We recommend notifying the hospital if you cannot attend, so they can accommodate other patients.",
    },
    {
      question: "Which hospitals are available for booking through HospitEase",
      answer:
        "HospitEase partners with a wide network of hospitals across the region. You can view the list of available hospitals in your area by selecting your location on the website.",
    },
  ];

  return (
    <div className="w-[80vw] mx-auto border-2   hover:shadow-xl hover:shadow-emerald-100">
      <section className="w-full py-8 md:py-8 lg:py-20 bg-white dark:bg-white mx-auto ">
        <div className="container px-4 md:px-4">
          <h2 className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-[#1c3f39]">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}1`} key={index}>
                <AccordionTrigger className="text-left text-xl hover:shadow-md px-3 rounded-md hover:text-emerald-600 transition-all duration-300 ease-in-out">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg px-3 rounded-md">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
