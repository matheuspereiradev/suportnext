import Head from 'next/head'
import React from 'react'
import { Header } from '@components/header'
import styles from './DefaultLayout.module.scss'

interface Props {
  titleKey: string
}

export const DefaultLayout: React.FC<Props> = ({ titleKey, children }) => {

    return (
    <div className={styles.defaultLayout}>
      <Head>
        <title>WA Suporte - {titleKey}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content="PT-BR" />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}