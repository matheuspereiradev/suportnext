import styles from "./style.module.scss";
import Link from 'next/link'

export function Header() {

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/logo.png" alt="WA logo" className={styles.logo}></img>
      </Link>

      <ul className={styles.navLinks}>
        <Link href="/login">
          <button className={styles.onlyText}>
            Entrar
            </button>
        </Link>

        <button className={styles.withBorder}>
          Cadastre-se
            </button>
      </ul>
    </header>
  );

}