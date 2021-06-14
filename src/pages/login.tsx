import { GetStaticProps } from "next";
import Link from 'next/link'
import { FormEvent, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/login.module.scss"
import { BlankLayout } from "@layouts/BlankLayout";

export default function Home() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleLogin } = useAuth()
    
    const sendFormLogin = (event: FormEvent)=>{
        event.preventDefault();
        handleLogin(email,password);
    }

    return (
        <BlankLayout titleKey="login">
            <main className={styles.loginPage}>

                <div className={styles.card}>
                    <div className={styles.content}>
                        <h1>Entrar</h1>
                        <div className={styles.loginForm}>
                            <form onSubmit={sendFormLogin}>
                                <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Email"/><br />
                                <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Senha"/><br />
                                <button type="submit">Entrar</button>
                                <Link href="/">
                                    <button className={styles.back}>Voltar</button>
                                </Link>
                            </form>
                            <div className={styles.forgotPassword}>Esqueci minha senha</div>
                        </div>

                    </div>

                </div>

            </main>

        </BlankLayout>
    )
}

export const getStaticProps:GetStaticProps = async ()=>{
 
    return{
      props:{
      },
  
      revalidate:60*60*24*30
    }
  }