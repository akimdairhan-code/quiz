"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClient, getRole, clearAuth } from "../../lib/api";
import { admin } from "../../lib/client";
import styles from "./page.module.css";

export default function AdminQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<admin.QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getRole() !== "admin") { router.push("/login"); return; }
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    try {
      const res = await getClient().admin.ListQuizzes();
      setQuizzes(res.quizzes ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить квиз?")) return;
    try {
      await getClient().admin.DeleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (e: any) { alert(e.message); }
  }

  async function handleTogglePublish(id: number) {
    try {
      const res = await getClient().admin.TogglePublish(id);
      setQuizzes(quizzes.map((q) => q.id === id ? { ...q, is_published: res.is_published } : q));
    } catch (e: any) { alert(e.message); }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Загрузка...</div>;

  return (
    <div className={quizzes.length === 0 ? styles.container : styles.containerFull}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои квизы</h1>
        <div className={styles.buttons}>
          <button className={styles.createBtn} onClick={() => router.push("/admin/quizzes/new")}>+ Создать квиз</button>
          <button className={styles.logoutBtn} onClick={() => { clearAuth(); router.push("/login"); }}>Выйти</button>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {quizzes.length === 0 ? (
        <div className={styles.empty}>Квизов пока нет. Создайте первый!</div>
      ) : (
        <div className={styles.grid}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <span className={quiz.is_published ? styles.published : styles.draft}>
                  {quiz.is_published ? "Опубликован" : "Черновик"}
                </span>
              </div>
              <p className={styles.meta}>{quiz.question_count} вопросов</p>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => router.push(`/admin/quizzes/${quiz.id}/edit`)}>Редактировать</button>
                <button className={quiz.is_published ? styles.hideBtn : styles.publishBtn} onClick={() => handleTogglePublish(quiz.id)}>
                  {quiz.is_published ? "Скрыть" : "Опубликовать"}
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(quiz.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}