import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy · Geoquiz" };

const CONTACT_EMAIL = "frgnjj.rgc@gmail.com";
const UPDATED = "November 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-10">
      <h1 className="text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">Privacy</h1>
      <p className="mt-3 text-muted">Last updated {UPDATED}.</p>

      <div className="mt-10 space-y-10 leading-relaxed">
        <Section title="The short version">
          <p>
            You can play Geoquiz without an account. If you sign in to save scores, we keep your
            username, your email address and your best scores. There are no ads, no tracking and no
            selling of data.
          </p>
        </Section>

        <Section title="Playing without an account">
          <p>Nothing about you is stored. Your browser keeps two small things on your device:</p>
          <List
            items={[
              "Your light or dark theme choice.",
              "A cookie with the last flag and capital shown on the home page, so the next visit shows different ones.",
            ]}
          />
        </Section>

        <Section title="With an account">
          <p>When you sign in with Google or an email link, we store:</p>
          <List
            items={[
              "Your email address, used only to sign you in. It is never shown to other players.",
              "The username you choose, which appears on leaderboards and your profile.",
              "Your best score on each leaderboard, with the date it was set.",
            ]}
          />
          <p>
            If you sign in with Google, we receive your name, email and profile picture from Google.
            Only the email is used.
          </p>
        </Section>

        <Section title="Who handles the data">
          <List
            items={[
              "Supabase stores accounts and scores.",
              "Vercel hosts the website and keeps short-lived technical logs, such as IP addresses, to run it.",
              "Google handles sign-in if you choose it.",
            ]}
          />
        </Section>

        <Section title="Your choices">
          <List
            items={[
              "Change your username at any time from your profile.",
              "Delete your account from your profile. This removes your email, username and scores for good.",
              "Ask for a copy of your data, or anything else about privacy, by emailing us.",
            ]}
          />
        </Section>

        <Section title="Contact">
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium underline decoration-line underline-offset-4 hover:decoration-foreground"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
