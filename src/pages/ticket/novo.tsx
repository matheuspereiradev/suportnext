import Head from "next/head";
import { GetServerSideProps } from "next";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/novo.module.scss";
import { parseCookies } from 'nookies';
import { clientAPIRequest } from '../../services/api';
import { FaCheckCircle, FaSave } from "react-icons/fa";

interface TicketNewPros {
    tickets: string
}

export default function TicketNew({ tickets }: TicketNewPros) {

    const { user } = useAuth();

    return (
        <>
            <Head>
                <title>WA Suporte - Tickets</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="copyright" content="WA" />
                <meta name="language" content="PT-BR" />
                <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
            </Head>
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Novo Ticket</h1>
                    <br />
                </div>
                <div className={styles.content}>
                    <form>
                        <label>Título:</label><br />
                        <input placeholder="Título" maxLength={100}></input>
                        <label >Descrição:</label><br />
                        <textarea
                            id="name"
                            maxLength={1000}
                            rows={7}
                        />
                        <div className={styles.buttonArea}>
                            <button className={styles.buttonSaveTicket}><FaCheckCircle /> Abrir Ticket</button>
                        </div>

                    </form>

                </div>
            </main>

        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { ['suportewatoken']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    const apiClient = clientAPIRequest(ctx)






    return {
        props: {

        }
    }
}
