"use client";

import "./main.css";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import { Creepster } from "next/font/google";

const CORRECT_CODE = "123456";
const STORAGE_KEY = "halloween-unlocked";
const TOMBSTONE_STORAGE_KEY = "halloween-tombstone-clicked";

const creepster = Creepster({
  weight: "400",
});

export default function Home() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "true",
  );
  const [showGlow, setShowGlow] = useState(false);
  const [tombstoneClicked, setTombstoneClicked] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(TOMBSTONE_STORAGE_KEY) === "true",
  );

  useEffect(() => {
    if (!unlocked) return;

    const glowTimer = window.setTimeout(() => setShowGlow(true), 15_000);
    return () => window.clearTimeout(glowTimer);
  }, [unlocked]);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code === CORRECT_CODE) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    }
  };

  const handleTombstoneClick = () => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      return;
    }
    window.localStorage.setItem(TOMBSTONE_STORAGE_KEY, "true");
    setTombstoneClicked(true);
  };

  return (
    <main className={`scene ${creepster.className}`}>
      <Image
        className="ghost ghostLeft"
        src="/ghost.png"
        alt=""
        width={100}
        height={100}
      />
      <Image
        className="ghost ghostRight"
        src="/ghost.png"
        alt=""
        width={100}
        height={100}
      />

      <Image
        className="ghost ghostRightTop"
        src="/ghost.png"
        alt=""
        width={100}
        height={100}
      />

      <section className="puzzle">
        <h1>Happy Halloween</h1>
        {unlocked ? (
          <p className="hint">Find me</p>
        ) : (
          <form className="unlockForm" onSubmit={handleUnlock}>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Enter the code"
              placeholder="Enter the code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <button type="submit">Unlock</button>
          </form>
        )}
      </section>

      <div className="tombstoneArea">
        <button
          type="button"
          className={showGlow ? "tombstones tombstonesGlow" : "tombstones"}
          aria-label="Inspect the tombstone"
          aria-pressed={tombstoneClicked}
          onClick={handleTombstoneClick}
        >
          <Image
            className="tombstoneImage"
            src="/tombstone.png"
            alt=""
            width={600}
            height={399}
            sizes="(max-width: 640px) 45vw, 22vw"
          />
        </button>
        {tombstoneClicked && (
          <p className="tombstoneHint">Final hint goes here.</p>
        )}
      </div>
    </main>
  );
}
