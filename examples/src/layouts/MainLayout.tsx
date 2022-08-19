import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <main className="bg-primary max-w-4xl w-full py-4">{children}</main>
      </div>
    </>
  );
}
