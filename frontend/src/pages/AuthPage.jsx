import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import { getTheme, setTheme, setMode, setToken } from "../lib/storage";
import { loginApi, registerApi, resetPasswordApi } from "../lib/api/auth";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [theme, setThemeState] = useState(getTheme());
  const [forgotOpen, setForgotOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);
  }, [theme]);

  async function handleLogin(payload) {
    try {
      const res = await loginApi(payload);

      const token = res && res.token ? res.token : "";
      if (!token) {
        alert("登入成功但沒有 token（請檢查後端回傳欄位）");
        return;
      }

      setToken(token);
      setMode("user");
      nav("/app");
    } catch (e) {
      alert("登入失敗：" + (e.message ? e.message : "Unknown error"));
    }
  }

  async function handleResetPassword(payload) {
    try {
      await resetPasswordApi(payload);
      alert("密碼已更新，請用新密碼登入");
      setForgotOpen(false);
    } catch (e) {
      alert("更新失敗：" + (e.message ? e.message : "Unknown error"));
    }
  }

  function handleGuest() {
    setToken("");
    setMode("guest");
    nav("/app");
  }

  async function handleRegister(payload) {
    try {
      await registerApi(payload);
      alert("註冊成功，請登入");
      setTab("login");
    } catch (e) {
      alert("註冊失敗：" + (e.message ? e.message : "Unknown error"));
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">📋 List Planner</div>
        <button
          className="icon-btn"
          onClick={() => {
            if (theme === "dark") setThemeState("light");
            else setThemeState("dark");
          }}
        >
          🌗
        </button>
      </div>

      <div className="center-wrap">
        <AuthCard tab={tab} onTabChange={setTab}>
          {tab === "login" ? (
            <LoginForm
              onLogin={handleLogin}
              onGuest={handleGuest}
              onForgot={() => setForgotOpen(true)}
            />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}
        </AuthCard>
      </div>

      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSubmit={handleResetPassword}
      />
    </div>
  );
}
