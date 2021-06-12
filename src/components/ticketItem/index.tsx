import styles from "./style.module.scss";
import Link from 'next/link'

interface ticket {
    status: string,
    icon: string,
    user: string,
    company: string,
    code: string,
    title: string,
    category: string,
    opendate: Date

}

export function TicketItem({ status, icon, user, company, code, title, category, opendate }: ticket) {

    return (
        <Link href={`/ticket/${code}`}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.firstLine}>
                        <img src={icon} />
                        <span>{status}</span><strong>|</strong>
                        <span> {user}</span><strong>|</strong>
                        <span> {company}</span>
                    </div>
                    <div className={styles.title}>
                        <strong>#{code}</strong><span> - {title}</span>
                    </div>
                    <div className={styles.categoryline}>
                        <span>{category}</span>
                    </div>
                </div>
                <div className={styles.dateContent}>
                    <span>{opendate}</span>
                </div>

            </div>
        </Link>
    );

}