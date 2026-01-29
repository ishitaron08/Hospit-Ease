import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Good evening, <span className="font-bold">Dr Courtney Henry</span>
          </h1>
        </div>
        <div className="flex items-center">
          <Input type="search" placeholder="Search..." className="mr-4" />
          <BellIcon className="h-6 w-6 mr-4" />
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Courtney Henry" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
