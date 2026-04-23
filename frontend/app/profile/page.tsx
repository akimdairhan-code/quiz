"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClient, getRole, isLoggedIn, clearAuth } from "../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [attempted, setAttempted] = useState(0);
  const [total, setTotal] = useState(0);
  const [created, setCreated] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    const r = getRole() ?? "";
    setRole(r);
    loadStats(r);
  }, []);

  async function loadStats(r: string) {
    try {
      if (r === "admin") {
        const res = await getClient().admin.ListQuizzes();
        setCreated(res.quizzes?.length ?? 0);
      } else {
        const res = await getClient().quiz.ListQuizzes();
        const quizzes = res.quizzes ?? [];
        setTotal(quizzes.length);
        setAttempted(quizzes.filter((q) => q.attempted).length);
      }
    } catch (e) {}
    finally { setLoading(false); }
  }

  if (loading) return <div style={s.center}>Загрузка...</div>;

  return (
    <div style={s.container}>
      <h1 style={s.title}>Мой профиль</h1>
      <div style={s.card}>
        <div style={s.row}>
          <span style={s.label}>Роль</span>
          <span style={s.badge}>{role === "admin" ? "Администратор" : "Пользователь"}</span>
        </div>
        {role === "admin" ? (
        <>
            <div style={s.row}>
            <span style={s.label}>Создано квизов</span>
            <span style={s.value}>{created}</span>
            </div>
            <div style={s.row}>
            <span style={s.label}>Пройдено квизов</span>
            <span style={s.value}>{created}</span>
            </div>
        </>
        ) : (
          <>
            <div style={s.row}>
              <span style={s.label}>Пройдено квизов</span>
              <span style={s.value}>{attempted}</span>
            </div>
            <div style={s.row}>
              <span style={s.label}>Всего доступно</span>
              <span style={s.value}>{total}</span>
            </div>
          </>
        )}
      </div>
      <button style={s.backBtn} onClick={() => router.back()}>← Назад</button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: { maxWidth: "500px", margin: "60px auto", padding: "0 16px" },
  center: { textAlign: "center", padding: "40px" },
  title: { fontSize: "28px", marginBottom: "24px", color: "#1a1a2e" },
  card: { background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" },
  label: { color: "#6b7280", fontSize: "15px" },
  value: { fontWeight: "bold", fontSize: "20px", color: "#1a1a2e" },
  badge: { background: "#eff6ff", color: "#3b82f6", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px" },
  backBtn: { marginTop: "24px", padding: "10px 20px", background: "black", border: "1px solid #000000", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "17px",fontWeight: "bold" },
};