import { FaBolt } from "react-icons/fa";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";

interface ticket {
    status: string,
    idStatus: number,
    user: string,
    company: string,
    code: string,
    title: string,
    category: string,
    opendate: Date

}

export function TicketItem({ status, idStatus, user, company, code, title, category, opendate }: ticket) {

    const [ico, setIco] = useState<string>('')
    useEffect(() => {
        switch (idStatus) {
            case 1:
                setIco('novo');
                break;
            case 2:
                setIco('andamento')
                break;
            case 4:
                setIco('pendente')
                break;
            case 5:
                setIco('finalizado')
                break;
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.firstLine}>
                    <img src={`ico-${ico}.svg`} />
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
    );

}