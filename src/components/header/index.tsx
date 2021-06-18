import styles from "./style.module.scss";
import Link from 'next/link'
import { useAuth } from "@contexts/AuthContext";
import { FaUserCircle,FaCaretDown, FaSignOutAlt, FaUserCog } from "react-icons/fa";

export function Header() {

  const { isLogged, user, handleLogout } = useAuth()
  return (
    <header className={styles.headerContainer}>
      {
        isLogged ? (
          <Link href="/ticket">
            <img src="/logo.png" alt="WA logo" className={styles.logo}></img>
          </Link>
        ) : (
          <Link href="/">
            <img src="/logo.png" alt="WA logo" className={styles.logo}></img>
          </Link >
        )
      }


      <ul className={styles.navLinks}>

        {
          isLogged ? (
            <>
              <div className={styles.dropdown} style={{float:"right"}}>
                <button className={styles.dropbtn}><FaUserCircle/> {user.name} <FaCaretDown/></button>
                <div className={styles.dropdownContent}>
                  <Link href="/usuario/perfil">
                  <a><FaUserCog/> Configurar</a>
                  </Link>
                  <a onClick={() => handleLogout()}><FaSignOutAlt/> Sair</a>
                </div>
              </div>
              {/* 
              <button className={styles.withBorder} onClick={() => handleLogout()}>
                Sair
            </button> */}
            </>
          ) : (
            <>
              <Link href="/login">
                <button className={styles.onlyText}>
                  Entrar
                </button>
              </Link>
            </>

          )
        }

      </ul>



    </header >
  );

}