"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SlotGrid from "@/components/component/BedComponent";
import axios from "axios";
import TopBar from "@/components/component/TopBar";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const searchParams = useSearchParams();
  const hospitalId = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [source, setSource] = useState("ONLINE");

  useEffect(() => {
    if (hospitalId) {
      const fetchHospitalName = async () => {
        const response = await axios.get(
          `${API_URL}/home/hospital-deatails/${hospitalId}`,
        );
        setHospitalName(response.data.hospitalName);
      };
      fetchHospitalName();
    }
  }, [hospitalId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }

    const patientRes = await axios.post(`${API_URL}/api/token/book`, {
      patientId: null,
      doctorId: selectedSlot.doctorId,
      slotStart: selectedSlot.slotStart,
      source,
      patientName: formData.name,
      patientContact: formData.contact,
    });

    alert(`Token booked! Token #${patientRes.data.tokenNumber}`);
    setFormData({ name: "", contact: "" });
    setSelectedSlot(null);
  };

  return (
    <div className="container mx-auto p-4">
      <TopBar />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-[#1c3f39] mt-4">
          {hospitalName || "Hospital OPD"}
        </h1>
      </div>

      <div className="mt-10 pt-10">
        <h2 className="text-2xl font-bold mb-4">Book OPD Token</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Booking Type</Label>
                <RadioGroup
                  value={source}
                  onValueChange={setSource}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <Label htmlFor="online">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WALKIN" id="walkin" />
                    <Label htmlFor="walkin">Walk-in</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FOLLOWUP" id="followup" />
                    <Label htmlFor="followup">Follow-up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PRIORITY" id="priority" />
                    <Label htmlFor="priority">Priority</Label>
                  </div>
                </RadioGroup>
              </div>
              {selectedSlot && (
                <div className="p-3 bg-green-100 rounded">
                  Selected:{" "}
                  {new Date(selectedSlot.slotStart).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
              <Button type="submit" className="w-full">
                Book Token
              </Button>
            </form>
          </div>

          <div>
            <SlotGrid onSlotSelect={handleSlotSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
