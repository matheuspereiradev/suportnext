import styles from "./style.module.scss";
import Link from 'next/link'
import { useAuth } from "../../contexts/AuthContext";

export function Header() {

  const { isLogged, user } = useAuth()
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/logo.png" alt="WA logo" className={styles.logo}></img>
      </Link>

      <ul className={styles.navLinks}>

        {
          isLogged ? (
            <>
              <div>{user.name}</div>
              <button className={styles.withBorder}>
                Sair
            </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className={styles.onlyText}>
                  Entrar
            </button>
              </Link>

              <button className={styles.withBorder}>
                Cadastre-se
            </button>
            </>

          )
        }

      </ul>



    </header >
  );

}