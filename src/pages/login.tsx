import Head from "next/head";
import styles from "../styles/login.module.scss"

export default function Home() {
    return (
        <>
            <Head>
                <title>WA Suporte - Login</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="copyright" content="WA" />
                <meta name="language" content="PT-BR" />
                <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
                <meta name="keywords" content="wa,suporte,wasolutions" />
            </Head>
            <main className={styles.loginPage}>

                <div className={styles.card}>
                    <div className={styles.content}>
                            <h1>Entrar</h1>
                            <div className={styles.loginForm}>
                            <input type="text" placeholder="Email"></input><br />
                            <input type="password" placeholder="Senha"></input><br />
                            <button>Entrar</button>
                            </div>
                            
                    </div>

                </div>

            </main>

        </>
    )
}
