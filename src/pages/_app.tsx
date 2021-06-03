import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { Header } from '../components/header'
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.appWrapper}>
      <AuthProvider>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </AuthProvider>
    </div>
  )
}

export default MyApp
