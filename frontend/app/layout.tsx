import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import styles from "@/app/page.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "quiz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
<<<<<<< Updated upstream
          <NavBar />
=======
          <nav className={styles.nav} style={{ paddingLeft: "32px" }}>
            <div className={styles.navLinks}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <form action="/auth/logout" method="post">
                <button type="submit">Logout</button>
              </form>
            ) : (
              <form action="/auth/login" method="post">
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button type="submit">Login</button>
              </form>
            )}
          </nav>
>>>>>>> Stashed changes
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}