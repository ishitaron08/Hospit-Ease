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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  RefreshCw,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SOURCE_COLORS = {
  PRIORITY: "bg-red-100 text-red-800 border-red-200",
  FOLLOWUP: "bg-blue-100 text-blue-800 border-blue-200",
  ONLINE: "bg-green-100 text-green-800 border-green-200",
  WALKIN: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_COLORS = {
  QUEUED: "bg-yellow-100 text-yellow-800",
  CALLED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NOSHOW: "bg-gray-100 text-gray-800",
};

export default function QueueManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchQueue();
      const interval = setInterval(fetchQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedDoctor]);

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
        if (docs.length > 0) {
          setSelectedDoctor(docs[0].doctorId);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchQueue = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/token/queue/${selectedDoctor}`);
      const data = await res.json();
      setQueue(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const callPatient = async (tokenId) => {
    try {
      await fetch(`${API_URL}/api/token/${tokenId}/call`, { method: "POST" });
      fetchQueue();
    } catch (error) {
      console.error("Error calling patient:", error);
    }
  };

  const markComplete = async (tokenId) => {
    try {
      await fetch(`${API_URL}/api/token/${tokenId}/complete`, {
        method: "POST",
      });
      fetchQueue();
    } catch (error) {
      console.error("Error completing token:", error);
    }
  };

  const markNoShow = async (tokenId) => {
    try {
      await fetch(`${API_URL}/api/token/${tokenId}/noshow`, { method: "POST" });
      fetchQueue();
    } catch (error) {
      console.error("Error marking no-show:", error);
    }
  };

  const cancelToken = async (tokenId) => {
    try {
      await fetch(`${API_URL}/api/token/${tokenId}/cancel`, { method: "POST" });
      fetchQueue();
    } catch (error) {
      console.error("Error cancelling token:", error);
    }
  };

  const selectedDoctorData = doctors.find((d) => d.doctorId === selectedDoctor);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Token Queue</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor patient queues in real-time
          </p>
        </div>
        <Button
          onClick={fetchQueue}
          variant="outline"
          disabled={loading || !selectedDoctor}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Doctor Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Doctor</CardTitle>
          <CardDescription>
            Choose a doctor to view their patient queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.doctorId} value={doc.doctorId}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDoctorData && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                Max {selectedDoctorData.maxPerSlot || 10} patients per slot
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      {selectedDoctor && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {queue.filter((t) => t.status === "QUEUED").length}
                  </p>
                  <p className="text-sm text-gray-500">In Queue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {queue.filter((t) => t.status === "CALLED").length}
                  </p>
                  <p className="text-sm text-gray-500">Called</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {queue.filter((t) => t.status === "COMPLETED").length}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      queue.filter(
                        (t) =>
                          t.status === "CANCELLED" || t.status === "NOSHOW",
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500">Cancelled/No-show</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue</CardTitle>
          <CardDescription>
            Patients are sorted by priority: Priority → Follow-up → Online →
            Walk-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedDoctor ? (
            <div className="text-center py-8 text-gray-500">
              Please select a doctor to view their queue
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patients in queue. Book a token or run a simulation to see
              data.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Token #</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((token) => (
                  <TableRow key={token.tokenId}>
                    <TableCell className="font-bold text-lg">
                      #{token.tokenNumber}
                    </TableCell>
                    <TableCell>{token.patient?.name || "Unknown"}</TableCell>
                    <TableCell>{token.patient?.contact || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={SOURCE_COLORS[token.source]}
                      >
                        {token.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(token.slotStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[token.status]}>
                        {token.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {token.status === "QUEUED" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => callPatient(token.tokenId)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Token #{token.tokenNumber}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will cancel the token for{" "}
                                    {token.patient?.name}. This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Token
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => cancelToken(token.tokenId)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Cancel Token
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        {token.status === "CALLED" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => markComplete(token.tokenId)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => markNoShow(token.tokenId)}
                            >
                              No Show
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
