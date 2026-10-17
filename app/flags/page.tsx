import type { Metadata } from "next";
import Quiz from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Flags · Geoquiz" };

export default function FlagsPage() {
  return <Quiz mode="flags" />;
}
