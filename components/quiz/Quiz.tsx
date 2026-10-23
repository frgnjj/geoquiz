"use client";

import { useLayoutEffect, useState } from "react";
import type { Mode } from "@/lib/answers";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/quiz";
import SettingsScreen from "./SettingsScreen";
import Game, { type Result } from "./Game";
import Results from "./Results";

type Phase =
  | { name: "settings" }
  | { name: "playing"; round: number }
  | { name: "done"; results: Result[]; total: number; score: number };

export default function Quiz({ mode }: { mode: Mode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<Phase>({ name: "settings" });

  // Next.js keeps this page alive (hidden) after navigating away. Going back to settings when it
  // hides means returning to Flags or Capitals never reopens an old game or results screen.
  useLayoutEffect(() => {
    return () => setPhase({ name: "settings" });
  }, []);

  // Each screen starts at the top, even if the last one was scrolled down.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  function start(next: Settings) {
    setSettings(next);
    setPhase((p) => ({ name: "playing", round: p.name === "playing" ? p.round + 1 : Date.now() }));
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8 lg:pb-24">
      {phase.name === "settings" && (
        <SettingsScreen mode={mode} initial={settings} onStart={start} />
      )}
      {phase.name === "playing" && (
        <Game
          key={phase.round}
          mode={mode}
          settings={settings}
          onFinish={(results, total, score) =>
            setPhase({ name: "done", results, total, score })
          }
          onQuit={() => setPhase({ name: "settings" })}
        />
      )}
      {phase.name === "done" && (
        <Results
          mode={mode}
          settings={settings}
          results={phase.results}
          total={phase.total}
          score={phase.score}
          onPlayAgain={() => start(settings)}
          onChangeSettings={() => setPhase({ name: "settings" })}
        />
      )}
    </main>
  );
}
