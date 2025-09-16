import { Link, useRoute } from "wouter";
import { useEffect, useMemo, useState } from "react";

/** 타입과 저장 유틸을 이 파일에 내장 */
interface Letter {
  id: string;
  to: string;      // 받는 이 (원문)
  slug: string;    // URL key
  body: string;    // 편지 내용
  createdAt: number;
  x: number;       // 0~100 (%)
  y: number;       // 0~100 (%)
}

const DB_KEY = "ults.letters.v1";
const loadDB = (): Record<string, Letter[]> => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const saveDB = (db: Record<string, Letter[]>) =>
  localStorage.setItem(DB_KEY, JSON.stringify(db));

const getLetters = (slug: string): Letter[] => {
  const db = loadDB();
  return db[slug] || [];
};
const addLetter = (to: string, slug: string, body: string): Letter => {
  const db = loadDB();
  const list = db[slug] || [];
  const letter: Letter = {
    id: crypto.randomUUID(),
    to,
    slug,
    body: body.trim(),
    createdAt: Date.now(),
    x: Math.round(10 + Math.random() * 80),
    y: Math.round(10 + Math.random() * 70),
  };
  list.push(letter);
  db[slug] = list;
  saveDB(db);
  return letter;
};
/** ------------------------ */

export default function RecipientPage() {
  const [, params] = useRoute("/r/:slug");
  const slug = params?.slug ?? "";
  const to = localStorage.getItem(`ults.recipient.${slug}`) || slug;

  const [letters, setLetters] = useState<Letter[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLetters(getLetters(slug));
  }, [slug, open]);

  // 장식용 점
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
        <Link href="/"><a style={{ color: "#fff", textDecoration: "none" }}>← 돌아가기</a></Link>
        <h2 style={{ fontWeight: 700 }}>
          {to}에게 보내는 밤하늘
          <span style={{ opacity: .7, fontSize: 14, marginLeft: 8 }}>총 {letters.length}개의 별</span>
        </h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>편지 쓰기</button>
      </header>

      <main className="canvas">
        {/* 배경 점 */}
        {dots.map(d => (
          <span key={d.id}
                style={{
                  position: "absolute",
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  width: d.size,
                  height: d.size,
                  borderRadius: "999px",
                  background: "#fff",
                  opacity: d.opacity,
                  filter: "blur(.3px)"
                }}/>
        ))}

        {/* 저장된 편지 → 별 */}
        {letters.map(lt => (
          <button
            key={lt.id}
            className="star-dot"
            style={{ left: `${lt.x}%`, top: `${lt.y}%` }}
            onClick={() =>
              alert(`『${to}』에게 보낸 편지\n\n${lt.body}\n\n${new Date(lt.createdAt).toLocaleString()}`)
            }
            title={new Date(lt.createdAt).toLocaleString()}
          />
        ))}
      </main>

      <footer className="sky-footer">
        별을 클릭하면 편지를 다시 읽을 수 있어요. · 총 {letters.length}개의 별이 만들어졌습니다.
      </footer>

      {open && (
        <LetterModal
          to={to}
          slug={slug}
          onClose={() => setOpen(false)}
          onSaved={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function LetterModal({
  to, slug, onClose, onSaved,
}: { to: string; slug: string; onClose: () => void; onSaved: () => void; }) {
  const [text, setText] = useState("");

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    addLetter(to, slug, body);
    onSaved();
  };

  return (
    <div className="modal-backdrop" onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <h3>‘{to}’에게 편지 쓰기</h3>
        <p style={{ margin: "6px 0 12px", color: "#6b7280" }}>
          저장하면 이 편지는 밤하늘의 별이 됩니다.
        </p>
        <textarea
          className="textarea"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="여기에 편지를 적어주세요..."
        />
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>취소</button>
          <button className="btn btn-primary" onClick={submit} disabled={!text.trim()}>저장하기</button>
        </div>
      </div>
    </div>
  );
}
