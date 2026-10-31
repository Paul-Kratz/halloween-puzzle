"use client";

import "./main.css";
import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";
import { Grenze_Gotisch } from "next/font/google";

const CORRECT_CODE = "526874";
const STORAGE_KEY = "halloween-unlocked";
const UNLOCKED_AT_STORAGE_KEY = "halloween-unlocked-at";
const TOMBSTONE_STORAGE_KEY = "halloween-tombstone-clicked";
const GLOW_DELAY_MS = 60_000;
const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const grenzeGotish = Grenze_Gotisch({
  weight: ["100", "400"],
});

export default function Home() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [tombstoneClicked, setTombstoneClicked] = useState(false);
  const [unlockedAt, setUnlockedAt] = useState<number | null>(null);

  useEffect(() => {
    startTransition(() => {
      const isUnlocked = window.localStorage.getItem(STORAGE_KEY) === "true";
      const storedUnlockTime = window.localStorage.getItem(
        UNLOCKED_AT_STORAGE_KEY,
      );
      const savedUnlockTime = Number(storedUnlockTime);
      const hasStoredUnlockTime =
        storedUnlockTime !== null && Number.isFinite(savedUnlockTime);
      const unlockTime = hasStoredUnlockTime ? savedUnlockTime : Date.now();

      if (isUnlocked && !hasStoredUnlockTime) {
        window.localStorage.setItem(UNLOCKED_AT_STORAGE_KEY, `${unlockTime}`);
      }

      setUnlocked(isUnlocked);
      setUnlockedAt(isUnlocked ? unlockTime : null);
      setTombstoneClicked(
        window.localStorage.getItem(TOMBSTONE_STORAGE_KEY) === "true",
      );
    });
  }, []);

  useEffect(() => {
    if (!unlockedAt) return;

    const delay = Math.max(0, unlockedAt + GLOW_DELAY_MS - Date.now());
    const glowTimer = window.setTimeout(() => setShowGlow(true), delay);
    return () => window.clearTimeout(glowTimer);
  }, [unlockedAt]);

  const lastTap = useRef(0);

  const handleTap = (event: React.MouseEvent<HTMLButtonElement>) => {
    const now = event.timeStamp;

    if (now - lastTap.current < 350) {
      handleTombstoneClick();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };
  const handleUnlock = () => {
    if (code === CORRECT_CODE) {
      const unlockTime = Date.now();
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.localStorage.setItem(UNLOCKED_AT_STORAGE_KEY, `${unlockTime}`);
      setUnlocked(true);
      setUnlockedAt(unlockTime);
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
    <main
      className={`scene ${grenzeGotish.className}`}
      style={{ backgroundImage: `url(${assetPath("/background.webp")})` }}
    >
      <Image
        className="ghost ghostLeft"
        src={assetPath("/ghost.png")}
        alt=""
        width={100}
        height={100}
        loading="eager"
      />
      <Image
        className="ghost ghostRight"
        src={assetPath("/ghost.png")}
        alt=""
        width={100}
        height={100}
        loading="eager"
      />

      <Image
        className="ghost ghostRightTop"
        src={assetPath("/ghost.png")}
        alt=""
        width={100}
        height={100}
        loading="eager"
      />

      <section className="puzzle">
        <h1>Happy Halloween</h1>
        {unlocked ? (
          <p className={`hint ${tombstoneClicked ? "" : "upside-down"}`}>
            {tombstoneClicked ? (
              "Thank you for playing! Please find your reward in the post 📮."
            ) : (
              <span>
                Find your local <span className="little-text">G</span>host
              </span>
            )}
          </p>
        ) : (
          <div className="unlockForm">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              enterKeyHint="done"
              spellCheck={false}
              aria-label="Enter the code"
              placeholder="Enter the code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleUnlock();
                }
              }}
            />
            <button type="button" onClick={handleUnlock}>
              Unlock
            </button>
          </div>
        )}
      </section>

      <div className="tombstoneArea">
        <button
          type="button"
          className={showGlow ? "tombstones tombstonesGlow" : "tombstones"}
          aria-label="Inspect the tombstone"
          aria-pressed={tombstoneClicked}
          onClick={handleTap}
        >
          <Image
            className="tombstoneImage"
            src={assetPath("/tombstone.png")}
            alt=""
            width={600}
            height={399}
            sizes="(max-width: 640px) 45vw, 22vw"
            loading="lazy"
          />
        </button>
      </div>
    </main>
  );
}
