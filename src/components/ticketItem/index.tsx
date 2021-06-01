import styles from "./style.module.scss";

export function TicketItem() {

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.firstLine}>
                    <span>Em andamento</span><strong>|</strong>
                    <span> Matheus Lima</span><strong>|</strong>
                    <span> WA Solutions</span>
                </div>
                <div className={styles.title}>
                    <strong>#12345</strong><span> - Titulo aqui</span>
                </div>
                <div className={styles.categoryline}>
                    <span>Correção de erros</span>
                </div>
            </div>
            <div className={styles.date}>
                <span>2020</span>
                <strong>25 de jan</strong>
                <span>8:25</span>
            </div>

        </div>
    );

}