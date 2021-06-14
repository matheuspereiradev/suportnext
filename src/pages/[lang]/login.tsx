import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/login.module.scss"
import DefaultLayout from "../../Layout/DefaultLayout";
import { browserAPIRequest } from "@services/api";

export default function Home() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleLogin } = useAuth()
    
    const sendFormLogin = (event: FormEvent)=>{
        event.preventDefault();
        handleLogin(email,password);
    }

    return (
        <DefaultLayout titleKey="login">
            <main className={styles.loginPage}>

                <div className={styles.card}>
                    <div className={styles.content}>
                        <h1>Entrar</h1>
                        <div className={styles.loginForm}>
                            <form onSubmit={sendFormLogin}>
                                <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email"/><br />
                                <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Senha"/><br />
                                <button type="submit">Entrar</button>
                            </form>
                            <div className={styles.forgotPassword}>Esqueci minha senha</div>
                        </div>

                    </div>

                </div>

            </main>

        </DefaultLayout>
    )
}