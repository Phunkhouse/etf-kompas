import Image from 'next/image'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        className={styles.logo}
        src="/brand/logo-600w.png"
        alt="ETF Kompas"
        width={600}
        height={153}
        priority
      />
    </main>
  )
}
