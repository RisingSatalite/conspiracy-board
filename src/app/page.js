import Image from "next/image";
import CytoscapeComponent from "@/components/CytoscapeComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CytoscapeComponent/>
    </main>
  );
}
