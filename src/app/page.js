import Image from "next/image";
import CytoscapeComponent from "@/components/CytoscapeComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <CytoscapeComponent/>
    </main>
  );
}
