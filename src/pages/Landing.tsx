import "./Landing.css";
import { useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();  // Wouter 전용 navigate

  return (
    <div className="page">
      {/* 헤더 */}
      <header className="header">
        <div className="logo">Unsent Letters, To the Star</div>
        <nav className="nav">
          <button>편지 작성</button>
          <button>보관함</button>
        </nav>
      </header>

      {/* 본문 */}
      <div className="content">
        {/* 왼쪽 이미지 */}
        <div className="left">
          <div className="imageBox">
            <img src="/star.png" alt="product" />
          </div>
        </div>

        {/* 오른쪽 텍스트 */}
        <div className="right">
          <h2>ULTS</h2>
          <p className="sub">내가 작성한 편지가 별로 떠오르는 공간💫</p>



          <div className="mini-title">
            Detail
          </div>

          <div className="detail">
            <p>
              마음을 전하고 싶은 상대의 이름을 적어 주세요.<br />
              편지는 스스로 빛을 찾아가는 법을 알고 있으니까요.
            </p>

            <p>
              당신이 전하고 싶었지만 끝내 말하지 못했던 마음을<br />
              편지로 만들어 별로 띄워보내는 공간입니다.
            </p>
          </div>

          <div className="to-wrapper">
            <span className="to-label">To.</span>
            <input
              type="text"
              placeholder="누구에게 편지를 작성하고 싶나요?"
              className="to-input"
            />
          </div>

          <button className="actionBtn"
            onClick={() => navigate("/Constellation")}>편지 작성</button>
        </div>
      </div>
    </div>
  );
}
