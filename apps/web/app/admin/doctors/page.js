"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, RefreshCw } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queueCounts, setQueueCounts] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const hosRes = await fetch(`${API_URL}/home/hospital-deatails`);
      const hospitals = await hosRes.json();
      if (hospitals.length > 0) {
        const docRes = await fetch(
          `${API_URL}/api/doctors/${hospitals[0].hospitalId}`,
        );
        const docs = await docRes.json();
        setDoctors(docs);

        // Fetch queue counts for each doctor
        const counts = {};
        for (const doc of docs) {
          try {
            const qRes = await fetch(
              `${API_URL}/api/token/queue/${doc.doctorId}`,
            );
            const queue = await qRes.json();
            counts[doc.doctorId] = queue.length;
          } catch {
            counts[doc.doctorId] = 0;
          }
        }
        setQueueCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-[#1fa49f]" />
            Doctors
          </h1>
          <p className="text-gray-500 mt-1">
            Manage doctors and view their current queue status
          </p>
        </div>
        <Button onClick={fetchDoctors} variant="outline" disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Doctors Found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Run a simulation to create sample doctors and patients, or add
              doctors through the hospital management system.
            </p>
            <Link href="/admin/simulation">
              <Button className="bg-[#1c3f39] hover:bg-[#1fa49f]">
                Go to Simulation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#1c3f39]">
                    {doctors.length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Total Doctors</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {Object.values(queueCounts).reduce((a, b) => a + b, 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Patients in Queue
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">
                    {doctors.reduce(
                      (sum, d) => sum + (d.maxPerSlot || 10) * 5,
                      0,
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Daily Capacity
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Doctor List</CardTitle>
              <CardDescription>
                All registered doctors with their queue information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Max Per Slot</TableHead>
                    <TableHead>Current Queue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.doctorId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1c3f39] flex items-center justify-center text-white font-bold">
                            {doctor.name?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="font-semibold">{doctor.name}</p>
                            <p className="text-xs text-gray-500">
                              ID: {doctor.doctorId.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {doctor.maxPerSlot || 10} patients
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-bold">
                          {queueCounts[doctor.doctorId] || 0}
                        </span>
                        <span className="text-gray-500 text-sm"> waiting</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/queue?doctor=${doctor.doctorId}`}>
                          <Button size="sm" variant="outline">
                            View Queue
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
