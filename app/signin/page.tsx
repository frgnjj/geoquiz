import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import SignIn from "@/components/account/SignIn";

export const metadata: Metadata = { title: "Sign in · Geoquiz" };

export default function SignInPage() {
  return (
    <AuthCard title="Sign in" lead="Save your scores and see where you rank. No password needed.">
      <SignIn />
    </AuthCard>
  );
}
