import { useState } from "react";
import { isGmail } from "../../lib/validators";

export default function LoginForm({ onLogin, onGuest }) {
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
    onLogin();
  }

  return (
    <div className="form">
      <input
        className="input"
        placeholder="Gmail"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={pw}
        onChange={e => setPw(e.target.value)}
      />

      {err && <div className="error">{err}</div>}

      <div className="actions">
        <button className="btn primary" onClick={submit}>登入</button>
        <button className="btn" onClick={onGuest}>訪客登入</button>
      </div>
    </div>
  );
}
