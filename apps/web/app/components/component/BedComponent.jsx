"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SlotGrid({ onSlotSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch(`${API_URL}/home/hospital-deatails`);
      const hospitals = await res.json();
      if (hospitals.length > 0) {
        const docRes = await fetch(
          `${API_URL}/api/doctors/${hospitals[0].hospitalId}`,
        );
        const docs = await docRes.json();
        setDoctors(docs);
        if (docs.length > 0) setSelectedDoctor(docs[0]);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor) return;
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(
        `${API_URL}/api/doctor/${selectedDoctor.doctorId}/slots?date=${today}`,
      );
      const data = await res.json();
      setSlots(data);
    };
    fetchSlots();
  }, [selectedDoctor]);

  const handleDoctorChange = (event) => {
    const doc = doctors.find((d) => d.doctorId === event.target.value);
    if (doc) setSelectedDoctor(doc);
  };

  const handleSlotClick = (slot) => {
    if (slot.available > 0 && onSlotSelect) {
      onSlotSelect({
        doctorId: selectedDoctor.doctorId,
        slotStart: slot.slotStart,
      });
    }
  };

  const availableSlots = slots.filter((s) => s.available > 0).length;

  return (
    <div className="mx-auto p-4 max-w-sm bg-gray-100 rounded-lg shadow-lg flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Book OPD Slot</h1>
      <div className="mb-4 flex flex-col items-start gap-2">
        <div className="relative w-full">
          <select
            onChange={handleDoctorChange}
            value={selectedDoctor?.doctorId || ""}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            {doctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                {doc.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Available Slots:</span>
          <span className="inline-block bg-teal-100 text-teal-800 text-lg font-mono px-2 py-1 rounded-full">
            {availableSlots} / {slots.length}
          </span>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          {selectedDoctor?.name || "Select Doctor"}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <div
              key={slot.slotStart}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-md text-white font-bold text-xs
                ${slot.available > 0 ? "bg-teal-500 hover:bg-teal-600 cursor-pointer" : "bg-rose-500"}
                transition-colors duration-200 shadow-md
              `}
              title={`${new Date(slot.slotStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${slot.available}/${slot.maxCapacity}`}
              onClick={() => handleSlotClick(slot)}
            >
              <span>
                {new Date(slot.slotStart).toLocaleTimeString([], {
                  hour: "2-digit",
                })}
              </span>
              <span className="text-[10px]">
                {slot.available}/{slot.maxCapacity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
