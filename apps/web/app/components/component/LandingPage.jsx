"use client";

import Image from "next/image";
import { Star, ArrowUpRight, Globe } from "lucide-react";
import { FaHospital } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-3xl font-bold leading-tight">
            Your Health, Our Priority - Efficently Managed <br></br>
            <span className="text-bold text-5xl pt-4">Hopit-Ease</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Organizing OPD Queues, Managing Bed Flow, Streamlining Admissions,
            and Simplifying Inventory – Hospit-Ease, Your Trusted Partner in
            Family-Centered Healthcare.
          </p>
          <button
            size="lg"
            className="bg-[#1c3f39] text-white hover:bg-[#27574f] px-4 py-2 rounded-full"
            onClick={() => {
              router.push("/patient/dashboard");
            }}
          >
            Book Your Slot
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="font-semibold">5.0</span>
            <span className="text-muted-foreground">from 200+ reviews</span>
          </div>
        </div>
        <div className="">
          <div className="relative aspect-video">
            {/* Option 1: Local video file */}
            <video
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Option 2: YouTube embed (uncomment to use) */}
            {/* <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe> */}
          </div>
        </div>
      </div>
    </div>
  );
}
