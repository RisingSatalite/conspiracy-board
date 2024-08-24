import Image from "next/image";
import CytoscapeComponent from "@/components/CytoscapeComponent";
import ConspiracyBoard from "@/components/ConspiracyBoard";

export default function Home() {
  //Can use margin and padding
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ConspiracyBoard/>
    </main>
  );
}
