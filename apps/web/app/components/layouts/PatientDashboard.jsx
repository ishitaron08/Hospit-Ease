import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import PatientHeader from "@/components/component/PatientHeader";
export default function PatientDashboard() {
  return (
    <div>
      <PatientHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 m-12 ">
        <Card>
          <CardHeader>
            <CardTitle>Blood Donation Drive</CardTitle>
            <CardDescription>
              Join our upcoming blood donation event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Date: August 15, 2023</p>
            <p>Location: Central Hospital</p>
            <Button className="mt-4 bg-[#1fa49f]">Register Now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organ Donation Awareness</CardTitle>
            <CardDescription>
              Learn about the importance of organ donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Online Webinar</p>
            <p>Date: September 1, 2023</p>
            <Button className="mt-4 bg-[#1fa49f]">Join Webinar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plasma Therapy</CardTitle>
            <CardDescription>
              Discover how plasma therapy can save lives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Informational Session</p>
            <p>Date: August 25, 2023</p>
            <Button className="mt-4 bg-[#1fa49f]">Learn More</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Check-Up</CardTitle>
            <CardDescription>
              Schedule your annual health check-up with us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Location: Central Clinic</p>
            <p>Available Dates: September 5-10, 2023</p>
            <Button className="mt-4 bg-[#1fa49f]">Book Now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vaccination Program</CardTitle>
            <CardDescription>
              Participate in the free vaccination drive
            </CardDescription>
          </CardHeader>
          <CardContent className>
            <p>Date: September 20, 2023</p>
            <p>Location: Downtown Health Center</p>
            <Button className="mt-4 bg-[#1fa49f]">Sign Up</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Telemedicine Consultation</CardTitle>
            <CardDescription>
              Schedule an online consultation with our doctors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Available 24/7</p>
            <Button className="mt-4 bg-[#1fa49f]">Start Consultation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
