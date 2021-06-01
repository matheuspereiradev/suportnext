import styles from "./style.module.scss";

interface ticket{
    status:string,
    user:string,
    company:string,
    code:string,
    title:string,
    category:string,
    opendate:string
    
}

export function TicketItem({status,user,company,code,title,category,opendate}:ticket) {

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.firstLine}>
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