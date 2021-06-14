import Head from 'next/head'
import React, { useEffect } from 'react'
import { Header } from '@components/header'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Props {
  titleKey: string
}

const DefaultLayout: React.FC<Props> = ({ titleKey, children }) => {

    return (
    <>
      <Head>
        <title>WA Suporte - {titleKey}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="copyright" content="matheuspereiradev" />
        <meta name="language" content="PT-BR" />
        <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
        <meta name="keywords" content="wa,suporte,wasolutions" />
      </Head>
      <Header />
      <>
        {children}
      </>
    </>
  )
}

export default DefaultLayout;