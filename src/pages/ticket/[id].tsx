import Head from "next/head";
import { GetServerSideProps, GetStaticProps, NextPageContext } from "next";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/details.module.scss";
import { parseCookies } from 'nookies';
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { browserAPIRequest, clientAPIRequest } from '../../services/api';
import { Chat } from "../../components/chat";
import { Ticket } from "../../interfaces/Ticket";
import { InteractionProvider } from "../../contexts/InteractionContext";
import { useToast } from "../../contexts/ToastContext";
import Router from 'next/router'

interface props {
    ticket: Ticket
}

export default function TicketDetails({ ticket }: props) {

    const {addToast} = useToast();
    const {user} = useAuth();

    const cancelTicket = async (id: string) => {
        try {
            await browserAPIRequest.delete(`/ticket/${ticket.id}`);
            addToast({ title: "Sucesso", description: "Ticket cancelado com sucesso", type: "info" })
            Router.push('/ticket');
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao cancelar o ticket", type: "error" })
        }
    }

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
                    <h1>Detalhes do Ticket (<strong className={styles.idArea}><img src={`/${ticket.status.icon}`} />#{ticket.id}</strong>) {((user?.id===ticket.requester.id)&&(<button className={styles.cancelButton} onClick={() => { cancelTicket(ticket.id) }}>Cancelar</button>))}</h1>
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
                        <InteractionProvider>
                            <Chat openDate={ticket.created_at} description={ticket.description} messages={ticket.interactions} ticket={ticket.id} />
                        </InteractionProvider>
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
