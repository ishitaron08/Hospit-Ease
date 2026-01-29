"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  UsersRound,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function PatientSidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white h-screen transition-all duration-300 ${isHovered ? "w-64" : "w-16"} flex flex-col shadow-lg overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TooltipProvider>
        <div className="p-4 flex items-center">
          <span
            className={`text-indigo-600 font-semibold ${isHovered ? "block" : "hidden"}`}
          >
            HospitEase
          </span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2 p-2">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Home"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<Users size={20} />}
              text="Appointments"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<UsersRound size={20} />}
              text="Staffs"
              subItems={["Doctor", "Nurse"]}
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<FileText size={20} />}
              text="Lab reports"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<UsersRound size={20} />}
              text="My team"
              isHovered={isHovered}
            />
            <SidebarItem
              icon={<MessageSquare size={20} />}
              text="Chat"
              badge="17"
              isHovered={isHovered}
            />
          </ul>
        </nav>
      </TooltipProvider>
    </div>
  );
}

const SidebarItem = ({ icon, text, subItems, badge, isHovered }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <li className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => subItems && setIsSubMenuOpen(!isSubMenuOpen)}
          >
            {icon}
            {isHovered && (
              <>
                <span className="ml-3">{text}</span>
                {badge && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium ml-auto px-2.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
                {subItems && (
                  <ChevronRight
                    size={16}
                    className={`ml-auto transition-transform ${isSubMenuOpen ? "rotate-90" : ""}`}
                  />
                )}
              </>
            )}
          </a>
        </TooltipTrigger>
        <TooltipContent side="right" className={isHovered ? "hidden" : "block"}>
          {text}
        </TooltipContent>
      </Tooltip>
      {subItems && isHovered && isSubMenuOpen && (
        <ul className="ml-6 mt-2 space-y-2">
          {subItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
