import Image from "next/image";
import logo from "@/public/AurikaLogo.png";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image
          src={logo}
          alt="Aurika Logo"
          width={500}
          className="mb-4"
        /></div>
    </>
  );
}
