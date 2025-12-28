import "./Constellation.css";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "wouter";

type Emotion = "happy" | "sad" | "angry" | "calm";

/** 편지를 위한 타입 */
interface Letter {
  id: string;
  body: string;
  createdAt: number;
  x: number; // 위치 %
  y: number; // 위치 %
  emotion: Emotion;
}

const DB_KEY = "ults.letters.noName";

/** DB 로드/저장 */
const loadLetters = (): Letter[] => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLetters = (letters: Letter[]) =>
  localStorage.setItem(DB_KEY, JSON.stringify(letters));

const emotionColorMap: Record<Emotion, string> = {
  happy: "#FCD34D", // 노랑
  sad: "#60A5FA",   // 파랑
  angry: "#F87171", // 빨강
  calm: "#A7F3D0",  // 민트
};


/** 새로운 편지 저장 */
const addLetter = (body: string, emotion: Emotion): Letter => {
  const letters = loadLetters();

  const letter: Letter = {
    id: crypto.randomUUID(),
    body: body.trim(),
    emotion, // ✅ 여기!
    createdAt: Date.now(),
    x: Math.round(10 + Math.random() * 80),
    y: Math.round(10 + Math.random() * 70),
  };

  letters.push(letter);
  saveLetters(letters);
  return letter;
};


/** 메인 페이지 */
export default function Constellation() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [open, setOpen] = useState(false);
  const [openedLetter, setOpenedLetter] = useState<Letter | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLetters(loadLetters());
  }, [open]);

  useEffect(() => {
    if (!bgmRef.current) return;

    const unmute = () => {
      bgmRef.current!.muted = false;
      bgmRef.current!.volume = 0.2; // 은은하게
      window.removeEventListener("click", unmute);
    };

    window.addEventListener("click", unmute);

    return () => {
      window.removeEventListener("click", unmute);
    };
  }, []);


  // 배경 점 생성
  const dots = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.25,
        size: Math.floor(Math.random() * 3) + 1,
      })),
    []
  );

  return (
    <div className="sky">
      <header className="sky-header">
        <Link href="/">
          <a style={{ color: "#fff", textDecoration: "none" }}>← Back</a>
        </Link>
        <h2 style={{ fontWeight: 700 }}>Unsent Words in the Sky</h2>

        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Create a Star
        </button>
      </header>

      <main className="canvas">
        {/* 배경 점 */}
        {dots.map((d) => (
          <span
            key={d.id}
            style={{
              position: "absolute",
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              borderRadius: "999px",
              background: "#fff",
              opacity: d.opacity,
              filter: "blur(.3px)",
            }}
          />
        ))}

        {/* 저장된 편지 → 별 */}
        {letters.map((lt) => (
          <button
            key={lt.id}
            className="star-dot"
            style={{
              left: `${lt.x}%`,
              top: `${lt.y}%`,
              backgroundColor: emotionColorMap[lt.emotion],
              boxShadow: `0 0 8px ${emotionColorMap[lt.emotion]}`,
            }}
            onClick={() => setOpenedLetter(lt)}
          />
        ))}
      </main>

      <footer className="sky-footer">
        {letters.length} stars have been created in this sky.
      </footer>

      {open && (
        <LetterModal
          onClose={() => setOpen(false)}
          onSaved={() => setOpen(false)}
        />
      )}

      {openedLetter && (
        <ReadLetterModal
          letter={openedLetter}
          onClose={() => setOpenedLetter(null)}
        />
      )}

      <audio
        ref={bgmRef}
        src="/Lullaby.mp3"
        autoPlay
        loop
        muted
      />

    </div>
  );
}

/** 편지 작성 모달 */
function LetterModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("happy");

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    addLetter(body, emotion);
    onSaved();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <h3>Write a Letter</h3>
        <p style={{ margin: "6px 0 12px", color: "#6b7280" }}>
          편지는 밤 하늘의 별로 저장됩니다.
        </p>

        <div className="emotion-picker">
          {([
            { key: "happy", emoji: "😊", label: "Happy" },
            { key: "sad", emoji: "😢", label: "Sad" },
            { key: "angry", emoji: "😡", label: "Angry" },
            { key: "calm", emoji: "😌", label: "Calm" },
          ] as const).map((e) => (
            <button
              key={e.key}
              type="button"
              className={`emotion-btn ${emotion === e.key ? "active" : ""}`}
              onClick={() => setEmotion(e.key)}
              aria-label={e.label}
            >
              <span className="emoji">{e.emoji}</span>
              <span className="label">{e.label}</span>
            </button>
          ))}
        </div>


        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={!text.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadLetterModal({
  letter,
  onClose
}: {
  letter: Letter;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <h3 style={{ marginBottom: "8px" }}>A letter I wrote before</h3>

        <p style={{
          whiteSpace: "pre-line",
          lineHeight: "1.6",
          marginBottom: "1rem",
          color: "#374151"
        }}>
          {letter.body}
        </p>

        <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          {new Date(letter.createdAt).toLocaleString()}
        </p>

        <div className="modal-actions" style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}