import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import PickUsername from "@/components/account/PickUsername";

export const metadata: Metadata = { title: "Pick a username · Geoquiz" };

export default function WelcomePage() {
  return (
    <AuthCard title="Pick a username" lead="It’s the name other players see on the leaderboards.">
      <PickUsername />
    </AuthCard>
  );
}
