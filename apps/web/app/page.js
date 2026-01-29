import Footer from "./components/component/Footer";
import Navbar from "./components/component/Navbar";
import Dashboardmain from "./components/component/LandingPage";
import Infinitymovingcard from "./components/component/Testimonials";
import FAQSection from "./components/component/faq-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Dashboardmain />
        <Infinitymovingcard />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
