"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Queue({ doctorId }) {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    if (!doctorId) return;
    const res = await fetch(`${API_URL}/api/token/queue/${doctorId}`);
    const data = await res.json();
    setQueue(data);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [doctorId]);

  const callPatient = async (tokenId) => {
    await fetch(`${API_URL}/api/token/${tokenId}/call`, { method: "POST" });
    fetchQueue();
  };

  const markNoShow = async (tokenId) => {
    await fetch(`${API_URL}/api/token/${tokenId}/noshow`, { method: "POST" });
    fetchQueue();
  };

  const completeToken = async (tokenId) => {
    await fetch(`${API_URL}/api/token/${tokenId}/complete`, { method: "POST" });
    fetchQueue();
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((token) => (
            <TableRow key={token.tokenId}>
              <TableCell>{token.tokenNumber}</TableCell>
              <TableCell>{token.patient?.name}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    token.source === "PRIORITY"
                      ? "bg-red-100 text-red-800"
                      : token.source === "FOLLOWUP"
                        ? "bg-blue-100 text-blue-800"
                        : token.source === "ONLINE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {token.source}
                </span>
              </TableCell>
              <TableCell>
                {new Date(token.slotStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => callPatient(token.tokenId)}>
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => completeToken(token.tokenId)}
                >
                  Done
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => markNoShow(token.tokenId)}
                >
                  No Show
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {queue.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No patients in queue
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
