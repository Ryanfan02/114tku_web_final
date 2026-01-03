import { useState, useEffect } from "react";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { getTheme, setTheme } from "../lib/storage";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);
  }, [theme]);

  function handleLogin() {
    
    alert("登入 OK（尚未串後端）");
  }

  function handleGuest() {
    alert("訪客登入 OK（尚未串後端）");
  }

  function handleRegister(payload) {
    alert("註冊 OK（尚未串後端）\n" + JSON.stringify(payload, null, 2));
    setTab("login");
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">📋 List Planner</div>
        <button
          className="icon-btn"
          onClick={() => setThemeState(theme === "dark" ? "light" : "dark")}
        >
          🌗
        </button>
      </div>

      <div className="center-wrap">
        <AuthCard tab={tab} onTabChange={setTab}>
          {tab === "login" ? (
            <LoginForm onLogin={handleLogin} onGuest={handleGuest} />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}
        </AuthCard>
      </div>
    </div>
  );
}
