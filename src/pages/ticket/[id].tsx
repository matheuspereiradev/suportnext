import {useRouter} from "next/router";
import { GetServerSideProps
 } from "next";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/ticket/details.module.scss";
import { parseCookies } from 'nookies';
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { browserAPIRequest, clientAPIRequest } from '@services/api';
import { Chat } from "@components/chat";
import { Ticket } from "@interfaces/Ticket";
import { InteractionProvider, useInteraction } from "@contexts/InteractionContext";
import { useToast } from "@contexts/ToastContext";
import Router from 'next/router'
import { DefaultLayout } from "@layouts/DefaultLayout";
import { useStatus } from "@contexts/StatusContext";

interface props {
    ticket: Ticket
}

export default function TicketDetails({ ticket }: props) {

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const { addToast } = useToast();
    const { user } = useAuth();
    const { status } = useStatus();

    const cancelTicket = async (id: string) => {
        try {
            await browserAPIRequest.delete(`/ticket/${id}`);
            addToast({ title: "Sucesso", description: "Ticket cancelado com sucesso", type: "info" })
            Router.push('/ticket');
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao cancelar o ticket", type: "error" })
        }
    }
    const changeStatusTicket = async (idStatus: string, idTicket:string) => {
        try {
            const tkt = await browserAPIRequest.patch(`/ticket/status/${idTicket}`,{status:idStatus});
            addToast({ title: "Sucesso", description: "Status do ticket atualizado", type: "success" })
            
            refreshData();
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao alterar status do ticket", type: "error" })
        }
    }

    

    return (
        <DefaultLayout titleKey="detalhes">
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Detalhes do Ticket (<strong className={styles.idArea}><img src={`/${ticket.status.icon}`} />#{ticket.id}</strong>) {(((user?.id === ticket.requester.id) || (user?.admin)) && (<button className={styles.cancelButton} onClick={() => { cancelTicket(ticket.id) }}>Cancelar</button>))}</h1>
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
                        <br/>
                        <strong>Status: </strong>
                        {
                            user?.admin ? (
                                <select defaultValue={ticket.status.id} className={styles.comboBox} onChange={(e)=>{changeStatusTicket(e.target.value,ticket.id)}}>
                                    {
                                        status?.map(e => {
                                            return (
                                                <option key={e.id} value={e.id} selected={e.id==ticket.status.id} >{e.name}</option>
                                            )
                                        }
                                        )
                                    }
                                </select>

                            ) : (
                                <>
                                    <img src={`/${ticket.status.icon}`} /><span>{` ${ticket.status.name}`}</span>
                                </>
                            )

                        }
                        <strong> Categoria:</strong><span>{` ${ticket.category.name}`}</span>
                        <strong>Aberto em:</strong><span>{` ${ticket.created_at}`}</span>
                        <InteractionProvider>
                            <Chat openDate={ticket.created_at} description={ticket.description} messages={ticket.interactions} ticket={ticket.id} />
                        </InteractionProvider>
                    </div>

                </div>
            </main>
        </DefaultLayout>
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
