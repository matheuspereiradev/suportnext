import '@styles/global.scss'
import styles from '@styles/app.module.scss'
import { AuthProvider } from '@contexts/AuthContext'
import { ToastProvider } from '@contexts/ToastContext'
import { StatusProvider } from '@contexts/StatusContext'
import { CategoryProvider } from '@contexts/CategoriesContext'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.appWrapper}>
      <ToastProvider>
        <AuthProvider>
          <StatusProvider>
            <CategoryProvider>
              <Component {...pageProps} />
            </CategoryProvider>
          </StatusProvider>
        </AuthProvider>
      </ToastProvider>
    </div>
  )
}

export default MyApp
