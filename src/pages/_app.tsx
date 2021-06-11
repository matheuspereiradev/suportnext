import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { Header } from '../components/header'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'
import { StatusProvider } from '../contexts/StatusContext'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.appWrapper}>
      <ToastProvider>
        <AuthProvider>
          <StatusProvider>
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
          </StatusProvider>
        </AuthProvider>
      </ToastProvider>
    </div>
  )
}

export default MyApp
