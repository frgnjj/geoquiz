import { Suspense } from "react";
import type { Metadata } from "next";
import Profile from "@/components/account/Profile";

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  return { title: `${decodeURIComponent(username)} · Geoquiz` };
}

export default function ProfilePage({ params }: PageProps<"/u/[username]">) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-8">
      {/* The username is only known per request. */}
      <Suspense>
        <PlayerProfile params={params} />
      </Suspense>
    </main>
  );
}

async function PlayerProfile({ params }: { params: PageProps<"/u/[username]">["params"] }) {
  const { username } = await params;
  return <Profile username={decodeURIComponent(username)} />;
}
