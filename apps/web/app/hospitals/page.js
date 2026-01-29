"use client";
import { useState, useEffect } from "react";
import HospitalCard from "@/components/component/HospitalCard";
import PatientHeader from "@/components/component/PatientHeader";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const coordinates = {
  Modal_Town:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83939150798!2d77.06889953178454!3d28.720164099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02b8eb6b078b%3A0x503cda0c7b716f8c!2sModel%20Town%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1695223524881!5m2!1sen!2sin",
  Defence_Colony:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28047.482788137364!2d77.22822105548416!3d28.566991656774187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce30acb1e3c8d%3A0x387cdd166e874d76!2sDefence%20Colony%2C%20New%20Delhi%2C%20Delhi%20110024!5e0!3m2!1sen!2sin!4v1695223665042!5m2!1sen!2sin",
  Rohini:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28037.387975308045!2d77.07262543955077!3d28.736515004773464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02b8eb6b078b%3A0x503cda0c7b716f8c!2sRohini%2C%20New%20Delhi%2C%20Delhi%20110085%2C%20India!5e0!3m2!1sen!2sus!4v1695222859445!5m2!1sen!2sus",
  Dwarka:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28033.315265735135!2d76.9639932827432!3d28.592864899530453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d17b5489619cf%3A0x4acb0e16ccbfeb9a!2sDwarka%2C%20Delhi!5e0!3m2!1sen!2sin!4v1695223722116!5m2!1sen!2sin",
  Chanakyapuri:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28050.48883148209!2d77.18005816091828!3d28.58072855241251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1dcf3c1e5b6b%3A0xb14dbb503f8b920a!2sChanakyapuri%2C%20New%20Delhi%2C%20Delhi%20110021!5e0!3m2!1sen!2sin!4v1695223772678!5m2!1sen!2sin",
  New_Delhi:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.9175022379!2d76.83978672874909!3d28.646677258118267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd32c26d5e45%3A0x3e4c2ea0780c65c7!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1695223833721!5m2!1sen!2sin",
};

export default function Home() {
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const searchParams = useSearchParams();
  const location = searchParams.get("location");

  // Get map URL from coordinates or set a default URL
  const mapUrl = coordinates[location] || coordinates["New_Delhi"];

  // Log location and mapUrl for debugging
  console.log("Location:", location);
  console.log("Map URL:", mapUrl);

  // Fetch hospital details from the backend
  useEffect(() => {
    async function getDetails() {
      try {
        const res = await axios.get(`${API_URL}/home/hospital-deatails`);
        setHospitalDetails(res.data);
        console.log(res); // Assuming the response data is an array of hospital objects
      } catch (error) {
        console.error("Error fetching hospital details:", error);
      }
    }

    getDetails();
  }, []);

  // Filter hospitals by the selected location
  const filteredHospitals = hospitalDetails.filter(
    (hospital) => hospital.hospitalAddress === location,
  );

  return (
    <div>
      <PatientHeader />
      <div className="flex justify-center">
        <div className="grid grid-cols-2 w-full">
          {/* Hospital Cards */}
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredHospitals.map((hospital, index) => (
              <HospitalCard
                key={index}
                id={hospital.hospitalId}
                hospitalName={hospital.hospitalName}
                hospitalAddress={hospital.hospitalAddress}
              />
            ))}
          </div>

          {/* Map */}
          <div className="flex justify-center items-center">
            <iframe
              src={mapUrl} // Use curly braces for dynamic values
              width="100%"
              height="550"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
