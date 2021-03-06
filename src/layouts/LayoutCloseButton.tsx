import Head from 'next/head'
import Router from 'next/router'
import React from 'react'
import { Header } from '@components/header'
import styles from './LayoutCloseButton.module.scss'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { route } from 'next/dist/next-server/server/router'

interface Props {
  titleKey: string
}

export const LayoutCloseButton: React.FC<Props> = ({ titleKey, children }) => {
  return (
    <div className={styles.defaultLayout}>
      <Head>
        <title>Jake - {titleKey}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content="PT-BR" />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <Header />
      <main>
        <button className={styles.closeButton} onClick={() => { Router.back() }}> Voltar</button>
        {children}
      </main>
    </div>
  )
}