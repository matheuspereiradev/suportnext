import Head from "next/head";
import styles from "@styles/home.module.scss";
import { DefaultLayout } from "@layouts/DefaultLayout"

export default function Home() {
  return (
    <DefaultLayout titleKey="home">
      <main className={styles.homePage}>
        <h1>Sistema de suporte</h1>

      </main>
    </DefaultLayout>
  )
}
