"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlayCircle,
  RefreshCw,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
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

export default function SimulationPage() {
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/simulate`, {
        method: "POST",
      });
      const data = await res.json();

      // Transform the data to match expected format
      const transformed = {
        doctors:
          data.finalQueues?.map((q) => ({
            name: q.doctor,
            doctorId: q.doctorId,
          })) || [],
        totalTokens: data.summary?.totalTokens || 0,
        cancellations: Array(data.summary?.cancellations || 0).fill(
          "cancelled",
        ),
        noshows: Array(data.summary?.noshows || 0).fill("noshow"),
        emergencies: Array(data.summary?.emergencies || 0).fill("emergency"),
        finalQueues:
          data.finalQueues?.map((q) => ({
            doctorName: q.doctor,
            doctorId: q.doctorId,
            tokens:
              q.queue?.map((t) => ({
                tokenId: t.tokenId,
                tokenNumber: t.tokenNumber,
                patient: { name: t.patient },
                source: t.source,
                slotStart: t.slotStart,
                status: "QUEUED",
              })) || [],
          })) || [],
      };

      setSimulationResult(transformed);
      if (transformed.finalQueues?.length > 0) {
        setSelectedDoctor(transformed.finalQueues[0]);
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Simulation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OPD Simulation</h1>
          <p className="text-gray-500 mt-1">
            Simulate a full OPD day with 3 doctors, multiple patients, and
            real-world scenarios
          </p>
        </div>
        <Button
          onClick={runSimulation}
          disabled={loading}
          className="bg-[#1c3f39] hover:bg-[#1fa49f]"
          size="lg"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-5 w-5" />
              Run Simulation
            </>
          )}
        </Button>
      </div>

      {!simulationResult && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <PlayCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Simulation Data
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Click the "Run Simulation" button to simulate a full OPD day. This
              will create 3 doctors, 30 patients, and simulate bookings,
              cancellations, no-shows, and emergency insertions.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />3 Doctors
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />5 Time Slots (9AM - 2PM)
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Emergency Cases
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {simulationResult && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1c3f39]">
                  {simulationResult.doctors?.length || 3}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1c3f39]">
                  {simulationResult.totalTokens || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Cancellations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {simulationResult.cancellations?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Emergencies Added
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {simulationResult.emergencies?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Queues */}
          <Card>
            <CardHeader>
              <CardTitle>Doctor Queues After Simulation</CardTitle>
              <CardDescription>
                Final queue state after all bookings, cancellations, and
                emergency insertions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={selectedDoctor?.doctorName || ""}
                onValueChange={(val) =>
                  setSelectedDoctor(
                    simulationResult.finalQueues.find(
                      (q) => q.doctorName === val,
                    ),
                  )
                }
              >
                <TabsList className="mb-4">
                  {simulationResult.finalQueues?.map((queue) => (
                    <TabsTrigger
                      key={queue.doctorName}
                      value={queue.doctorName}
                    >
                      {queue.doctorName}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {simulationResult.finalQueues?.map((queue) => (
                  <TabsContent key={queue.doctorName} value={queue.doctorName}>
                    <div className="mb-4 flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Active in Queue:{" "}
                          <strong>{queue.tokens?.length || 0}</strong>
                        </span>
                      </div>
                    </div>

                    {queue.tokens?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">Token #</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Time Slot</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queue.tokens.map((token, idx) => (
                            <TableRow key={token.tokenId || idx}>
                              <TableCell className="font-bold">
                                #{token.tokenNumber}
                              </TableCell>
                              <TableCell>
                                {token.patient?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={SOURCE_COLORS[token.source]}
                                >
                                  {token.source}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(token.slotStart).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={STATUS_COLORS[token.status]}>
                                  {token.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No tokens in queue for this doctor
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Event Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Cancellations & No-Shows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {simulationResult.cancellations?.length > 0 ? (
                    simulationResult.cancellations.map((id, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-red-50 rounded"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Token {id} cancelled</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No cancellations</p>
                  )}
                  {simulationResult.noshows?.length > 0 &&
                    simulationResult.noshows.map((id, idx) => (
                      <div
                        key={`noshow-${idx}`}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Token {id} marked no-show
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Emergency Insertions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {simulationResult.emergencies?.length > 0 ? (
                    simulationResult.emergencies.map((id, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-orange-50 rounded"
                      >
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">
                          Emergency patient added (Token {id})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No emergency insertions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Priority System</CardTitle>
              <CardDescription>
                How tokens are prioritized in the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Badge className={SOURCE_COLORS.PRIORITY}>PRIORITY</Badge>
                  <span className="text-sm text-gray-600">
                    Highest priority - Emergency/Paid cases
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={SOURCE_COLORS.FOLLOWUP}>FOLLOWUP</Badge>
                  <span className="text-sm text-gray-600">
                    Follow-up appointments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={SOURCE_COLORS.ONLINE}>ONLINE</Badge>
                  <span className="text-sm text-gray-600">Online bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={SOURCE_COLORS.WALKIN}>WALKIN</Badge>
                  <span className="text-sm text-gray-600">
                    Walk-in patients (lowest priority)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
