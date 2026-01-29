"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Ticket, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SOURCE_INFO = {
  ONLINE: {
    label: "Online Booking",
    description: "Patient booking through the web portal",
    priority: 3,
  },
  WALKIN: {
    label: "Walk-in",
    description: "Patient visiting OPD desk directly",
    priority: 4,
  },
  FOLLOWUP: {
    label: "Follow-up",
    description: "Patient with a follow-up appointment",
    priority: 2,
  },
  PRIORITY: {
    label: "Priority/Paid",
    description: "Paid priority patient or special case",
    priority: 1,
  },
};

export default function BookTokenPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    doctorId: "",
    patientName: "",
    patientContact: "",
    source: "ONLINE",
    slotStart: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const hosRes = await fetch(`${API_URL}/home/hospital-deatails`);
      const hospitals = await hosRes.json();
      if (hospitals.length > 0) {
        const docRes = await fetch(
          `${API_URL}/api/doctors/${hospitals[0].hospitalId}`,
        );
        const docs = await docRes.json();
        setDoctors(docs);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date().toISOString().split("T")[0];
    for (let hour = 9; hour < 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({
        value: `${today}T${time}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
      });
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/token/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: null,
          doctorId: formData.doctorId,
          slotStart: formData.slotStart,
          source: formData.source,
          patientName: formData.patientName,
          patientContact: formData.patientContact,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(data);
        setFormData({
          doctorId: "",
          patientName: "",
          patientContact: "",
          source: "ONLINE",
          slotStart: "",
        });
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to book token");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to book token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.doctorId === formData.doctorId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-[#1fa49f]" />
          Book OPD Token
        </h1>
        <p className="text-gray-500 mt-1">
          Create a new token for a patient visit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Token Booking Form</CardTitle>
              <CardDescription>
                Enter patient details and select appointment slot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Patient Name *</Label>
                    <Input
                      id="name"
                      value={formData.patientName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientName: e.target.value,
                        })
                      }
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      type="tel"
                      value={formData.patientContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientContact: e.target.value,
                        })
                      }
                      placeholder="Enter contact number"
                      required
                    />
                  </div>
                </div>

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor *</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, doctorId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => (
                        <SelectItem key={doc.doctorId} value={doc.doctorId}>
                          {doc.name} (Max {doc.maxPerSlot || 10}/slot)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-2">
                  <Label htmlFor="slot">Time Slot *</Label>
                  <Select
                    value={formData.slotStart}
                    onValueChange={(value) =>
                      setFormData({ ...formData, slotStart: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {slot.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Booking Source */}
                <div className="space-y-3">
                  <Label>Booking Type *</Label>
                  <RadioGroup
                    value={formData.source}
                    onValueChange={(value) =>
                      setFormData({ ...formData, source: value })
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(SOURCE_INFO).map(([key, info]) => (
                      <div key={key}>
                        <RadioGroupItem
                          value={key}
                          id={key}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={key}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#1fa49f] [&:has([data-state=checked])]:border-[#1fa49f] cursor-pointer"
                        >
                          <span className="font-semibold">{info.label}</span>
                          <span className="text-xs text-gray-500 text-center mt-1">
                            {info.description}
                          </span>
                          <Badge variant="outline" className="mt-2">
                            Priority: {info.priority}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.doctorId ||
                    !formData.slotStart ||
                    !formData.patientName
                  }
                  className="w-full bg-[#1c3f39] hover:bg-[#1fa49f]"
                  size="lg"
                >
                  {loading ? (
                    "Booking..."
                  ) : (
                    <>
                      <Ticket className="mr-2 h-5 w-5" />
                      Book Token
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Success Card */}
          {success && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Token Booked!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    #{success.tokenNumber}
                  </div>
                  <p className="text-sm text-green-700">
                    Token created successfully
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">
                      Slot:{" "}
                      {new Date(success.slotStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <Badge className="mt-2">{success.source}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priority Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority System</CardTitle>
              <CardDescription>
                How tokens are ordered in the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(SOURCE_INFO)
                  .sort((a, b) => a[1].priority - b[1].priority)
                  .map(([key, info]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 rounded bg-gray-50"
                    >
                      <span className="text-sm font-medium">{info.label}</span>
                      <Badge variant="outline">#{info.priority}</Badge>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Lower number = Higher priority. Patients are called in order of
                priority within each time slot.
              </p>
            </CardContent>
          </Card>

          {/* Slot Capacity */}
          {selectedDoctor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1c3f39] flex items-center justify-center text-white font-bold">
                    {selectedDoctor.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-500">
                      Max {selectedDoctor.maxPerSlot || 10} patients per slot
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
