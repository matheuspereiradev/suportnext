import Head from 'next/head'
import React from 'react'
import styles from './BlankLayout.module.scss'

interface Props {
  titleKey: string
}

export const BlankLayout: React.FC<Props> = ({ titleKey, children }) => {

    return (
    <div className={styles.blankLayout}>
      <Head>
        <title>WA Suporte - {titleKey}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content="PT-BR" />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <main>
        {children}
      </main>
    </div>
  )
}