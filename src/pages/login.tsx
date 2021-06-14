import { GetStaticProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import { useToast } from "@contexts/ToastContext";
import styles from "@styles/login.module.scss"

export default function Home() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleLogin } = useAuth()
    
    const sendFormLogin = (event: FormEvent)=>{
        event.preventDefault();
        handleLogin(email,password);
    }

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

        </>
    )
}

export const getStaticProps:GetStaticProps = async ()=>{
 
    return{
      props:{
      },
  
      revalidate:60*60*24*30
    }
  }