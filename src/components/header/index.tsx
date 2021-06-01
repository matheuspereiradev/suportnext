import styles from "./style.module.scss";

export function Header(){

    return (
        <header className={styles.headerContainer}>
          <img src="/logo.png" alt="WA logo" className={styles.logo}></img>  
          <ul className={styles.navLinks}>
            <button className={styles.onlyText}>
              Entrar
            </button>
            <button className={styles.withBorder}>
              Cadastre-se
            </button>
          </ul> 
        </header>
    );

}