import { useState } from "react";
import { minLen } from "../../lib/validators";

export default function RegisterForm({ onRegister }) {
  const [account, setAccount] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    if (!account) {
      setErr("請輸入註冊帳號");
      return;
    }
    if (!minLen(pw1, 8)) {
      setErr("密碼至少 8 碼");
      return;
    }
    if (!pw2) {
      setErr("請再次確認密碼");
      return;
    }
    if (pw1 !== pw2) {
      setErr("兩次輸入的密碼不一致");
      return;
    }

    setErr("");
    onRegister({ account, password: pw1 });
  }

  return (
    <div className="form">
      <input
        className="input"
        placeholder="註冊帳號"
        value={account}
        onChange={e => setAccount(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="設定密碼"
        value={pw1}
        onChange={e => setPw1(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="再次確認密碼"
        value={pw2}
        onChange={e => setPw2(e.target.value)}
      />

      {err && <div className="error">{err}</div>}

      <div className="actions">
        <button className="btn primary" onClick={submit}>註冊</button>
      </div>
    </div>
  );
}
