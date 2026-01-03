export default function AuthCard({ tab, onTabChange, children }) {
  return (
    <div className="card">
      <div className="tabs">
        <button
          className={tab === "login" ? "tab active" : "tab"}
          onClick={() => onTabChange("login")}
        >
          登入
        </button>
        <button
          className={tab === "register" ? "tab active" : "tab"}
          onClick={() => onTabChange("register")}
        >
          註冊
        </button>
      </div>

      <div className="card-body">{children}</div>
    </div>
  );
}
