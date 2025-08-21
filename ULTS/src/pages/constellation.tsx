import { useState, useRef } from "react";

interface StarLetter {
    id: string;
    x: number;
    y: number;
    title: string;
    content: string;
    date: string;
    size: number;
    opacity: number;
}

export default function ConstellationPage() {
    const [letters, setLetters] = useState<StarLetter[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [newLetter, setNewLetter] = useState<{ title: string; content: string }>({ title: "", content: "" });
    const [selectedStar, setSelectedStar] = useState<StarLetter | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // 별 생성 함수
    const createStar = (title: string, content: string) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const newStar: StarLetter = {
            id: Date.now().toString(),
            x: Math.random() * (rect.width - 40) + 20,
            y: Math.random() * (rect.height - 40) + 20,
            title,
            content,
            date: new Date().toLocaleDateString("ko-KR"),
            size: Math.random() * 8 + 12, // 12~20px
            opacity: Math.random() * 0.3 + 0.7, // 0.7~1.0
        };
        setLetters(prev => [...prev, newStar]);
    };

    // 편지 제출
    const handleSubmitLetter = () => {
        if (newLetter.title.trim() && newLetter.content.trim()) {
            createStar(newLetter.title, newLetter.content);
            setNewLetter({ title: "", content: "" });
            setIsWriting(false);
            // (선택) 마지막 별 살짝 반짝이기
            setTimeout(() => {
                const lastStar = document.querySelector(".star:last-child");
                if (lastStar) lastStar.classList.add("animate-pulse");
            }, 100);
        }
    };

    // 별 클릭
    const handleStarClick = (star: StarLetter) => setSelectedStar(star);

    return (
        <div className="constellation-wrap">
            {/* 배경 별 (반드시 CSS에서 .bg-stars { pointer-events:none } 적용) */}
            <div className="bg-stars">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
                        }}
                    />
                ))}
            </div>

            {/* 헤더 */}
            <header className="header">
                <div className="header-inner">
                    <button className="btn" onClick={() => history.back()}>
                        <span className="icon">←</span> 돌아가기
                    </button>

                    <h1 className="page-title">별자리 만들기</h1>

                    {/* ✅ 모달 열기 */}
                    <button className="btn btn-primary" onClick={() => setIsWriting(true)}>
                        <span className="icon">✉</span> 편지 쓰기
                    </button>
                </div>
            </header>

            {/* 별자리 캔버스 */}
            <div ref={canvasRef} className="canvas">
                {letters.length === 0 && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            color: "#e5e7eb",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 32, lineHeight: 1 }}>✦</div>
                            <p style={{ marginTop: 8 }}>편지를 써서 첫 번째 별을 만들어보세요</p>
                            <small style={{ opacity: 0.8 }}>당신의 마음이 별이 되어 하늘에 떠오를 거예요</small>
                        </div>
                    </div>
                )}

                {letters.map(star => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            left: star.x,
                            top: star.y,
                            opacity: star.opacity,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                        }}
                        onClick={() => handleStarClick(star)}
                    >
                        <div className="star-shape" />     {/* ⬅ 이 줄이 실제 별 모양 */}
                        <div className="tooltip">{star.title}</div>

                        {/* 별 모양 (아이콘 없이도 보이게) */}
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                background: "radial-gradient(#fff, #facc15)",
                                boxShadow: "0 0 8px 2px rgba(250,204,21,.8)",
                            }}
                        />
                        <div className="tooltip">{star.title}</div>
                    </div>
                ))}
            </div>

            {/* 편지 작성 모달 */}
            {isWriting && (
                <div className="modal">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">마음을 담은 편지</div>
                        </div>

                        <div>
                            <label>편지 제목</label>
                            <input
                                className="input"
                                placeholder="누구에게 보내는 편지인가요?"
                                value={newLetter.title}
                                onChange={e => setNewLetter(p => ({ ...p, title: e.target.value }))}
                            />
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <label>편지 내용</label>
                            <textarea
                                className="textarea"
                                placeholder="전하고 싶은 마음을 적어보세요..."
                                value={newLetter.content}
                                onChange={e => setNewLetter(p => ({ ...p, content: e.target.value }))}
                            />
                        </div>

                        <div className="card-actions">
                            <button className="btn" onClick={() => setIsWriting(false)}>
                                취소
                            </button>

                            {/* ✅ 제출 */}
                            <button className="btn btn-primary" onClick={handleSubmitLetter}>
                                <span className="icon">★</span> 별로 만들기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 별 상세보기 모달 */}
            {selectedStar && (
                <div className="modal">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">{selectedStar.title}</div>
                            <div>⭐</div>
                        </div>
                        <div className="card-date">{selectedStar.date}</div>
                        <p style={{ marginTop: 8, marginBottom: 16, lineHeight: 1.6 }}>{selectedStar.content}</p>
                        <button className="btn" style={{ width: "100%" }} onClick={() => setSelectedStar(null)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 하단 정보 */}
            <div className="footer">
                <div>별을 클릭하면 편지를 다시 읽을 수 있어요</div>
                <small>총 {letters.length}개의 별이 만들어졌습니다</small>
            </div>
        </div>
    );
}
