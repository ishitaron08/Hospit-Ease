"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/InfiniteMovingCards";

export default function Testimonials() {
  return (
    <div className="h-[25rem] rounded-md flex flex-col antialiased bg-white text-bold text-lg dark:bg-[white] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Thanks to HospitEase, I no longer have to worry about long queues in the OPD; the service is incredibly smooth.",
    name: "Abhijeet Singh",
    title: "",
  },
  {
    quote:
      "The user-friendly interface of HospitEase makes booking appointments a breeze, saving me so much time.",
    name: "Adarsh Gupta",
    title: "",
  },
  {
    quote:
      "HospitEase has made the outpatient experience much more convenient, allowing me to manage appointments effortlessly.",
    name: "Shivang Gupta",
    title: "",
  },
  {
    quote:
      "With HospitEase, I spend less time waiting and more time getting the care I need—it's a lifesaver!",
    name: "Jason Roy",
    title: "",
  },
  {
    quote:
      "HospitEase’s seamless integration with hospital systems ensures a hassle-free experience for patients and staff alike.",
    name: "Shubham Gill",
    title: "",
  },
];
