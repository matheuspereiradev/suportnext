import Head from "next/head";
import styles from "@styles/home.module.scss";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { FormEvent, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import Router from "next/router";


export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin, user } = useAuth()

  const sendFormLogin = (event: FormEvent) => {
    event.preventDefault();
    handleLogin(email, password);
  }

  if (user) {
    Router.push('/ticket');
  }

  return (
    <DefaultLayout titleKey="home">
      <main className={styles.homePage}>
        <div className={styles.content}>
          <div className={styles.leftArea}>
            <img src='/suporte.svg' style={{ width: 400 }} alt=" vetor criado por freepik https://br.freepik.com/vetores-gratis/ilustracao-plana-de-suporte-ao-cliente_13184991.htm" />
            <h1>Como podemos ajudar?</h1>
          </div>
          <div className={styles.rightArea}>
            <div className={styles.card}>
              <div className={styles.content}>
                <div className={styles.loginForm}>
                  <form onSubmit={sendFormLogin}>
                    <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" /><br />
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Senha" /><br />
                    <button type="submit">Entrar</button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </DefaultLayout>
  )
}
