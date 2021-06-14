import { useTranslate } from '@contexts/Translate'
import Head from 'next/head'
import React from 'react'

interface Props {
  titleKey: string
}

export const Layout: React.FC<Props> = ({ titleKey, children }) => {
  const { t } = useTranslate()
  return (
    <>
      <Head>
        <title>WA Suporte - {t(titleKey)}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content="PT-BR" />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <>{children}</>
    </>
  )
}

