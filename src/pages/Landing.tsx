import { useState } from "react";
import { useLocation } from "wouter";

// slugify 함수 그대로 사용
const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-가-힣]/g, "");

export default function Landing() {
  const [, navigate] = useLocation();
  const [to, setTo] = useState("");

  const go = () => {
    const v = to.trim();
    if (!v) return;
    const slug = slugify(v);
    localStorage.setItem(`ults.recipient.${slug}`, v);
    navigate(`/r/${encodeURIComponent(slug)}`);
  };

  return (
    <main className="hero text-center">
      {/* 헤더 */}
      <h1 className="text-4xl font-bold text-gray-900">마음을 전하는 편지</h1>
      <p className="mt-2 text-lg text-pink-700 font-semibold">그 별에 닿기를 ✨</p>

      {/* 설명 */}
      <p className="mt-6 text-gray-600 leading-relaxed max-w-xl mx-auto">
        아직 전하지 못한 말들을 편지로 남겨보세요.<br />
        당신의 이야기가 별빛이 되어 빛납니다.
      </p>

      {/* 입력 박스 */}
      <div className="mt-8 bg-white shadow-md rounded-2xl p-6 max-w-md mx-auto">
        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
          ✉️ 누구에게 편지를 쓰고 싶나요?
        </label>
        <input
          id="to"
          className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          placeholder="예) 첫사랑에게, 미래의 나에게, 엄마에게 …"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          maxLength={40}
          onKeyDown={(e) => { if (e.key === "Enter") go(); }}
        />
        <p className="text-xs text-gray-500 mt-2">
          이름이나 호칭을 적고 Enter 키를 눌러도 시작할 수 있어요.
        </p>

        <button
          className="mt-4 w-full btn bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 disabled:opacity-40"
          onClick={go}
          disabled={!to.trim()}
        >
          편지 쓰기 ✨
        </button>
      </div>
    </main>
  );
}
