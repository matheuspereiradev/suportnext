import { TranslateProvider, useTranslate } from '@contexts/Translate'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { Header } from '@components/header'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Locale, isLocale } from '@translations/types'

interface Props {
  titleKey: string
}

const DefaultLayout: React.FC<Props> = ({ titleKey, children }) => {
  const { t } = useTranslate();
  const { query } = useRouter();
  const [local,setLocal] = useState<Locale>();

  useEffect(() => {
    if (typeof query.lang === 'string' && isLocale(query.lang) && local !== query.lang) {
      setLocal(query.lang)
  }
  }, [query.lang, local])

  return (
    <TranslateProvider lang={local}>
      <Head>
        <title>WA Suporte - {t(titleKey)}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content={local} />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <Header />
      <>
        {children}
      </>
    </TranslateProvider>
  )
}

export default DefaultLayout;