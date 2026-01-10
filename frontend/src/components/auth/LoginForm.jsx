import { useState } from "react";
import { isGmail } from "../../lib/validators";

export default function LoginForm({ onLogin, onGuest, onForgot }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (!isGmail(email)) {
      setErr("請輸入 Gmail");
      return;
    }
    if (!pw) {
      setErr("請輸入密碼");
      return;
    }

    setErr("");
    onLogin({ username: email, password: pw });
  }

  return (
    <div className="form">
      <input
        className="input"
        placeholder="Gmail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      {err && <div className="error">{err}</div>}

      {/* ✅ 三個按鈕同一排 */}
      <div className="actions" style={{ display: "flex", gap: 10 }}>
        <button className="btn primary" onClick={submit} style={{ flex: 1 }}>
          登入
        </button>
        <button className="btn" onClick={onGuest} style={{ flex: 1 }}>
          訪客登入
        </button>
        <button className="btn" onClick={onForgot} style={{ flex: 1 }}>
          忘記密碼
        </button>
      </div>
    </div>
  );
}
