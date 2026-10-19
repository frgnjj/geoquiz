"use client";

import { useState } from "react";
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

  function start(next: Settings) {
    setSettings(next);
    setPhase((p) => ({ name: "playing", round: p.name === "playing" ? p.round + 1 : Date.now() }));
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-8 pb-24">
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
