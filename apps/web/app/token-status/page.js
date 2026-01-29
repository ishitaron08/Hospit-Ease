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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Ticket,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_CONFIG = {
  QUEUED: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    message: "You are in the queue. Please wait for your turn.",
  },
  CALLED: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Phone,
    message: "You have been called! Please proceed to the doctor's room.",
  },
  COMPLETED: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    message: "Your consultation is complete. Thank you for visiting!",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    message: "This token has been cancelled.",
  },
  NOSHOW: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: AlertCircle,
    message: "Marked as no-show. Please contact the reception.",
  },
};

const SOURCE_COLORS = {
  PRIORITY: "bg-red-100 text-red-800",
  FOLLOWUP: "bg-blue-100 text-blue-800",
  ONLINE: "bg-green-100 text-green-800",
  WALKIN: "bg-gray-100 text-gray-800",
};

export default function TokenStatusPage() {
  const [searchContact, setSearchContact] = useState("");
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchTokens = async (e) => {
    e?.preventDefault();
    if (!searchContact.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${API_URL}/api/token/status/${encodeURIComponent(searchContact)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTokens(Array.isArray(data) ? data : [data]);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error("Error searching tokens:", error);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Ticket className="h-8 w-8 text-[#1fa49f]" />
            Check Token Status
          </h1>
          <p className="text-gray-500 mt-2">
            Enter your contact number to view your token status and queue
            position
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={searchTokens} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="contact" className="sr-only">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Enter your contact number"
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !searchContact.trim()}
                className="bg-[#1c3f39] hover:bg-[#1fa49f] h-12 px-8"
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <>
            {tokens.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Ticket className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Tokens Found
                  </h3>
                  <p className="text-gray-500 text-center">
                    No active tokens found for this contact number.
                    <br />
                    Please check the number and try again.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Found {tokens.length} token(s)
                </h2>

                {tokens.map((token) => {
                  const statusConfig =
                    STATUS_CONFIG[token.status] || STATUS_CONFIG.QUEUED;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={token.tokenId} className="overflow-hidden">
                      <div
                        className={`h-2 ${
                          token.status === "QUEUED"
                            ? "bg-yellow-500"
                            : token.status === "CALLED"
                              ? "bg-blue-500"
                              : token.status === "COMPLETED"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                      />
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          {/* Token Number */}
                          <div className="text-center md:text-left">
                            <p className="text-sm text-gray-500 mb-1">
                              Your Token
                            </p>
                            <div className="text-6xl font-bold text-[#1c3f39]">
                              #{token.tokenNumber}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {token.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={SOURCE_COLORS[token.source]}
                              >
                                {token.source}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600">
                              {statusConfig.message}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>{token.patient?.name || "Patient"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                  Slot:{" "}
                                  {new Date(token.slotStart).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>

                            {token.doctor && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-gray-500">
                                  Doctor:{" "}
                                  <span className="font-medium text-gray-900">
                                    {token.doctor.name}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Queue Position */}
                          {token.status === "QUEUED" && token.queuePosition && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">
                                Queue Position
                              </p>
                              <p className="text-3xl font-bold text-gray-900">
                                {token.queuePosition}
                              </p>
                              <p className="text-xs text-gray-500">
                                patients ahead
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Info Cards */}
        {!searched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  QUEUED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  You are in the waiting queue. Please wait for your number to
                  be called.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  CALLED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  Your number has been called! Please proceed to the doctor's
                  room immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  COMPLETED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  Your consultation is complete. Thank you for visiting our
                  hospital.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
