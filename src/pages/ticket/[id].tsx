import Head from "next/head";
import { GetServerSideProps, GetStaticProps, NextPageContext } from "next";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/details.module.scss";
import { parseCookies } from 'nookies';
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { clientAPIRequest } from '../../services/api';
import { Chat } from "../../components/chat";

interface Interaction {
    id: string,
    text: string,
    file: string,
    idTicket: number,
    isPrivate: boolean,
    created_at: Date,
    sender: User
}

interface Status {
    id: number,
    name: string,
    icon: string
}

interface Company {
    id: number,
    name: string,
}

interface Category {
    id: number,
    name: string,
}

interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    gender: string
}

interface Ticket {
    id: string,
    title: string,
    description: string,
    created_at: Date,
    requester: User
    status: Status,
    company: Company,
    category: Category,
    interactions: Interaction[]
}

interface props {
    ticket: Ticket
}

export default function TicketList({ ticket }: props) {

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
                <div>
                    <h1>Detalhes do Ticket (<strong className={styles.idArea}><img src={`/${ticket.status.icon}`} />#{ticket.id}</strong>)</h1>
                    <hr />
                    <br />
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <h2>{ticket.title}</h2>
                    </div>
                    <div className={styles.details}>
                        <strong>Solicitante:</strong><span>{` ${ticket.requester.name} ${ticket.requester.surname} (${ticket.requester.email})`}</span>
                        <strong>Empresa:</strong><span>{` ${ticket.company.name}`}</span>
                        <strong>Status:</strong><img src={`/${ticket.status.icon}`} /><span>{` ${ticket.status.name}`}</span>
                        <strong>Categoria:</strong><span>{` ${ticket.category.name}`}</span>
                        <strong>Aberto em:</strong><span>{` ${ticket.created_at}`}</span>
                        <Chat openDate={ticket.created_at} description={ticket.description} messages={ticket.interactions} />
                    </div>

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

    const id = ctx.params.id;

    const apiClient = clientAPIRequest(ctx)

    const { data } = await apiClient.get(`ticket/find/${id}`);

    const interactionArray = data.interactions.map(msg => {
        return {
            id: msg.id,
            text: msg.text,
            file: msg.file,
            idTicket: msg.idTicket,
            isPrivate: msg.isPrivate,
            created_at: format(parseISO(msg.created_at), 'dd MMM yyyy HH:mm', { locale: ptBR }),
            sender: msg.sender
        }
    })

    const ticket = {
        id: data.id,
        title: data.title,
        description: data.description,
        created_at: format(parseISO(data.created_at), 'dd MMM yyyy HH:mm', { locale: ptBR }),
        requester: data.requester,
        status: data.status,
        company: data.company,
        category: data.category,
        interactions: interactionArray
    }

    return {
        props: {
            ticket
        }
    }
}
