"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";
import { isLoggedIn, clearAuth, getRole } from "@/app/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/users", label: "User List" },
];

export default function NavBar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setRole(getRole() ?? "");
  }, []);

  function handleLogout() {
    clearAuth();
    setLoggedIn(false);
    router.push("/login");
  }

  return (
    <nav className={styles.nav} style={{ paddingLeft: "32px" }}>
      <div className={styles.navLinks}>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </div>

      {loggedIn ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
          <span
            onClick={() => router.push("/profile")}
            style={{ fontSize: "14px", opacity: 0.8, cursor: "pointer" }}>
            {role === "admin" ? "👤 Админ" : "👤 Пользователь"}
          </span>
          <button
            onClick={handleLogout}
            style={{ padding: "6px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Выйти
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <input type="text" placeholder="Email" style={{ padding: "5px 8px", borderRadius: "2px", border: "none" }} />
          <input type="password" placeholder="Password" style={{ padding: "5px 8px", borderRadius: "2px", border: "none" }} />
          <button style={{ padding: "5px 8px", background: "white", border: "none", borderRadius: "2px", cursor: "pointer" }}>Login</button>
        </div>
      )}
    </nav>
  );
}