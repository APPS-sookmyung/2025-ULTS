import "./Landing.css";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [openToModal, setOpenToModal] = useState(false);
  const [to, setTo] = useState("");

  return (
    <div className="page">
      {/* 헤더 */}
      <header className="header">
        <div className="logo">Unsent Letters, To the Star</div>
        <nav className="nav">
          <button onClick={() => navigate("/Constellation")}>
            편지 작성
          </button>
          <button>보관함</button>
        </nav>
      </header>

      {/* 배경 이미지 */}
      <section className="hero">
        <button
          className="hero-actionBtn"
          onClick={() => setOpenToModal(true)}
        >
          편지 작성 <span className="arrow">&gt;</span>
        </button>
      </section>

      {/* 본문 */}
      <section className="body">
        <div className="detail">
          <p>내가 작성한 편지가 별로 떠오르는 공간💫</p>

          <p>
            마음을 전하고 싶은 상대의 이름을 적어 주세요.<br />
            편지는 스스로 빛을 찾아가는 법을 알고 있으니까요.
          </p>

          <p>
            당신이 전하고 싶었지만 끝내 말하지 못했던 마음을<br />
            편지로 만들어 별로 띄워보내는 공간입니다.
          </p>
        </div>
      </section>

      {/* To 입력 모달 */}
      {openToModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenToModal(false);
          }}
        >
          <div className="modal to-modal">
            <div className="to-wrapper">
              <span className="to-label">To.</span>
              <input
                className="to-input"
                placeholder="누구에게 편지를 작성하고 싶나요?"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setOpenToModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate("/Constellation");
                }}
                disabled={!to.trim()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}