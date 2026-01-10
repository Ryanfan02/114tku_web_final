import { useEffect, useState } from "react";
import { isGmail, minLen } from "../../lib/validators";

export default function ForgotPasswordModal({ open, onClose, onSubmit }) {
  const [username, setUsername] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setUsername("");
      setPw1("");
      setPw2("");
      setErr("");
    }
  }, [open]);

  if (!open) return null;

  function submit() {
    if (!isGmail(username)) {
      setErr("請輸入 Gmail");
      return;
    }
    if (!minLen(pw1, 8)) {
      setErr("新密碼至少 8 碼");
      return;
    }
    if (!pw2) {
      setErr("請再次確認新密碼");
      return;
    }
    if (pw1 !== pw2) {
      setErr("兩次輸入的新密碼不一致");
      return;
    }

    setErr("");
    onSubmit({
      username,
      newPassword: pw1,
      confirmNewPassword: pw2,
    });
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">忘記密碼</div>

        <div className="modal-row">
          <div className="label">帳號</div>
          <input
            className="input"
            placeholder="Gmail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="label">新密碼</div>
          <input
            className="input"
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="label">確認新密碼</div>
          <input
            className="input"
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
        </div>

        {err ? <div className="error">{err}</div> : null}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>取消</button>
          <button className="btn primary" onClick={submit}>更新密碼</button>
        </div>
      </div>
    </div>
  );
}
