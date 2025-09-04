import { useState } from "react";
import { useLocation } from "wouter";

// 파일 없이 쓰는 간단 slugify
const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-가-힣]/g, "");

export default function Landing() {
  const [, navigate] = useLocation();
  const [to, setTo] = useState("");

  const go = () => {
    const v = to.trim();
    if (!v) return;
    const slug = slugify(v);
    // 대상 원문만 저장(헤더 표시용)
    localStorage.setItem(`ults.recipient.${slug}`, v);
    navigate(`/r/${encodeURIComponent(slug)}`);
  };

  return (
    <main className="hero">
      <p>APPS 신입 부원 개인 프로젝트</p>
      <h1>전달할 수 없는 편지</h1>
      <p className="subtitle" style={{ marginTop: ".25rem", color: "#a21caf", fontWeight: 700 }}>
        그 별에 닿기를
      </p>

      <p style={{ marginTop: "1rem", color: "#4b5563", lineHeight: 1.6 }}>
        마음 속 깊은 곳에 간직한 이야기들과 꿈을 향한 여정.<br />
        전하지 못한 마음들이 별이 되어 우리를 비춥니다.
      </p>

      <div className="form">
        <label className="label" htmlFor="to">✉️ 누구에게 편지를 전하고 싶나요?</label>
        <input
          id="to"
          className="input"
          placeholder="예) 첫사랑에게 / 떠난 친구에게 / 미래의 나에게 / 엄마에게 …"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          maxLength={40}
          onKeyDown={(e) => { if (e.key === "Enter") go(); }}
        />
        <p className="helper">자유롭게 이름/호칭을 적고, Enter로 시작할 수 있어요.</p>
      </div>

      <div className="hero-buttons" style={{ marginTop: "1rem" }}>
        <button className="btn btn-outline" onClick={go} disabled={!to.trim()}>
          별자리 만들기
        </button>
      </div>
    </main>
  );
}
