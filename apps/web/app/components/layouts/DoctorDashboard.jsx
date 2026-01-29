"use client";

import { useState, useEffect } from "react";
import SideBar from "@/components/component/SideBar";
import TopBar from "@/components/component/DoctorTopbar";
import Queue from "@/components/component/Queue";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DoctorDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-6">
        <TopBar />
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Patient Queue</h2>
            <select
              className="border rounded px-3 py-1"
              value={selectedDoctor?.doctorId || ""}
              onChange={(e) =>
                setSelectedDoctor(
                  doctors.find((d) => d.doctorId === e.target.value),
                )
              }
            >
              {doctors.map((doc) => (
                <option key={doc.doctorId} value={doc.doctorId}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
          <Queue doctorId={selectedDoctor?.doctorId} />
        </div>
      </main>
    </div>
  );
}
