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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Zap, Clock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmergencyPage() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    patientId: "",
    newPatientName: "",
    newPatientContact: "",
    slotStart: "",
  });

  const [useExistingPatient, setUseExistingPatient] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
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

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
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
    setSuccess(false);

    try {
      let patientId = formData.patientId;

      // Create new patient if not using existing
      if (!useExistingPatient && formData.newPatientName) {
        const patientRes = await fetch(`${API_URL}/api/patients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.newPatientName,
            contact: formData.newPatientContact,
          }),
        });
        if (patientRes.ok) {
          const newPatient = await patientRes.json();
          patientId = newPatient.patientId;
        }
      }

      const res = await fetch(`${API_URL}/api/token/emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId: formData.doctorId,
          slotStart: formData.slotStart,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        alert(
          `Emergency token created! Token #${data.tokenNumber} - Patient will be seen first.`,
        );
        setFormData({
          doctorId: "",
          patientId: "",
          newPatientName: "",
          newPatientContact: "",
          slotStart: "",
        });
      } else {
        throw new Error("Failed to create emergency token");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create emergency token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Emergency Token
        </h1>
        <p className="text-gray-500 mt-1">
          Insert an emergency patient at the front of the queue
        </p>
      </div>

      {/* Warning Card */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Important Notice</h3>
              <p className="text-sm text-red-700 mt-1">
                Emergency tokens are inserted at position #1 in the queue. All
                other patients will be pushed back by one position. Use this
                feature only for genuine medical emergencies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Emergency Token</CardTitle>
          <CardDescription>
            Fill in the details to add an emergency patient to the front of the
            queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      {doc.name}
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

            {/* Patient Type Toggle */}
            <div className="space-y-2">
              <Label>Patient Type</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={!useExistingPatient ? "default" : "outline"}
                  onClick={() => setUseExistingPatient(false)}
                  className={!useExistingPatient ? "bg-[#1c3f39]" : ""}
                >
                  New Patient
                </Button>
                <Button
                  type="button"
                  variant={useExistingPatient ? "default" : "outline"}
                  onClick={() => setUseExistingPatient(true)}
                  className={useExistingPatient ? "bg-[#1c3f39]" : ""}
                >
                  Existing Patient
                </Button>
              </div>
            </div>

            {useExistingPatient ? (
              <div className="space-y-2">
                <Label htmlFor="patient">Select Patient *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, patientId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem
                        key={patient.patientId}
                        value={patient.patientId}
                      >
                        {patient.name} - {patient.contact}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Patient Name *</Label>
                  <Input
                    id="name"
                    value={formData.newPatientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newPatientName: e.target.value,
                      })
                    }
                    placeholder="Enter patient name"
                    required={!useExistingPatient}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.newPatientContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newPatientContact: e.target.value,
                      })
                    }
                    placeholder="Enter contact number"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !formData.doctorId || !formData.slotStart}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Create Emergency Token
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>How Emergency Insertion Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>
              All existing patients in the selected time slot are pushed back by
              one position
            </li>
            <li>
              The emergency patient receives Token #1 with PRIORITY status
            </li>
            <li>
              The queue is automatically reordered to accommodate the emergency
              case
            </li>
            <li>Other patients' token numbers are updated accordingly</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
