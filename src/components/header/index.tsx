import styles from "./style.module.scss";
import Link from 'next/link'
import { useAuth } from "@contexts/AuthContext";
import { FaUserCircle, FaCaretDown, FaSignOutAlt, FaUserCog, FaCode, FaSitemap, FaFileCode } from "react-icons/fa";

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
              <div className={styles.dropdown} style={{ float: "right" }}>
                <button className={styles.dropbtn}><FaUserCircle /> {user.name} <FaCaretDown /></button>
                <div className={styles.dropdownContent}>
                  <Link href="/usuario/perfil">
                    <a><FaUserCog /> Configurar</a>
                  </Link>
                  <a onClick={() => handleLogout()}><FaSignOutAlt /> Sair</a>
                </div>
              </div>

              {user.admin && (
                <div className={styles.dropdown} style={{ float: "right" }}>
                  <button className={styles.dropbtn}><FaCode /> Área dev <FaCaretDown /></button>
                  <div className={styles.dropdownContent}>
                    <Link href="/dev/dashboard">
                      <a><FaFileCode /> Dashboard</a>
                    </Link>
                    <Link href="/dev/sprints">
                      <a><FaSitemap /> Sprints</a>
                    </Link>

                  </div>
                </div>
              )}
              {/* 
              <button  onClick={() => handleLogout()}>
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