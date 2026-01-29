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
import {
  Users,
  Ticket,
  Clock,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalTokensToday: 0,
    activeQueues: 0,
    completedToday: 0,
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const hosRes = await fetch(`${API_URL}/home/hospital-deatails`);
      const hospitals = await hosRes.json();

      if (hospitals.length > 0) {
        const docRes = await fetch(
          `${API_URL}/api/doctors/${hospitals[0].hospitalId}`,
        );
        const docs = await docRes.json();
        setDoctors(docs);
        setStats((prev) => ({ ...prev, totalDoctors: docs.length }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const quickActions = [
    {
      title: "Book New Token",
      description: "Create a new OPD token for a patient",
      href: "/admin/book",
      icon: Ticket,
      color: "bg-blue-500",
    },
    {
      title: "View Queue",
      description: "Monitor current patient queues",
      href: "/admin/queue",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Emergency Insert",
      description: "Add an emergency patient to queue",
      href: "/admin/emergency",
      icon: Activity,
      color: "bg-red-500",
    },
    {
      title: "Run Simulation",
      description: "Simulate a full OPD day",
      href: "/admin/simulation",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to the OPD Token Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Doctors
            </CardTitle>
            <Users className="h-5 w-5 text-[#1fa49f]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-500 mt-1">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Tokens
            </CardTitle>
            <Ticket className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTokensToday}</div>
            <p className="text-xs text-gray-500 mt-1">Booked today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Queues
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeQueues}</div>
            <p className="text-xs text-gray-500 mt-1">Currently waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Today
            </CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-gray-500 mt-1">Patients served</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Doctors</CardTitle>
          <CardDescription>
            Doctors currently registered in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1c3f39] flex items-center justify-center text-white font-bold">
                    {doctor.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-semibold">{doctor.name}</p>
                    <p className="text-sm text-gray-500">
                      Max {doctor.maxPerSlot || 10} patients/slot
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No doctors found. Run a simulation to create sample data.
              </p>
              <Link href="/admin/simulation">
                <Button className="mt-4 bg-[#1c3f39] hover:bg-[#1fa49f]">
                  Go to Simulation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
