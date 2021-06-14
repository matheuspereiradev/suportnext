import { defaultLocale } from '@translations/config';
import strings from '@translations/strings';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Locale, isLocale } from '@translations/types'

interface TraslateContextProps {
    readonly locale: Locale
    readonly setLocale: (locale: Locale) => void
}

export const TranslateContext = createContext({} as TraslateContextProps)


export const TranslateProvider = ({ children }) => {

    const [locale, setLocale] = useState<Locale>();
    const { query } = useRouter()

    useEffect(() => {
        if (locale !== localStorage.getItem('locale')) {
            localStorage.setItem('locale', locale)
        }
    }, [locale])

    useEffect(() => {
        if (typeof query.lang === 'string' && isLocale(query.lang) && locale !== query.lang) {
            setLocale(query.lang)
        }
    }, [query.lang, locale])

    return (
        <TranslateContext.Provider value={{ locale, setLocale }}>
            {children}
        </TranslateContext.Provider>
    )

}

export const useTranslate = () => {
    const { locale } = useContext(TranslateContext)

    function t(key: string) {
        if (!strings[locale][key]) {
            console.warn(`Translation '${key}' for locale '${locale}' not found.`)
        }
        return strings[locale][key] || strings[defaultLocale][key] || ''
    }

    return {
        t,
        locale
    }
}

