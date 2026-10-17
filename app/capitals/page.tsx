import type { Metadata } from "next";
import Quiz from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Capitals · Geoquiz" };

export default function CapitalsPage() {
  return <Quiz mode="capitals" />;
}
