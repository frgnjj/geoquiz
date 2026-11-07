import type { Metadata } from "next";
import Quiz from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Maps · Geoquiz" };

export default function MapsPage() {
  return <Quiz mode="maps" />;
}
