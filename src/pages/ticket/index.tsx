import Head from "next/head";
import Link from 'next/link'
import { GetServerSideProps, GetStaticProps, NextPageContext } from "next";
import { TicketItem } from "../../components/ticketItem";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/index.module.scss";
import { parseCookies } from 'nookies';
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { clientAPIRequest } from '../../services/api';
import { FaFilter, FaPlusCircle } from 'react-icons/fa'

interface Status {
  id: number,
  name: string,
}

interface Company {
  id: number,
  name: string,
}

interface Category {
  id: number,
  name: string,
}

interface Requester {
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
  requester: Requester
  status: Status,
  company: Company,
  category: Category
}

interface TicketListPros {
  tickets: Array<Ticket>
}

export default function TicketList({ tickets }: TicketListPros) {

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
          <h1>Tickets</h1>
          <br />
        </div>
        <div className={styles.content}>
          <div className={styles.leftArea}>
            <div className={styles.componentsLeft}>
              <div className={styles.buttonArea}>
                <Link href="/ticket/novo">
                  <button className={styles.buttonAddTicket}><FaPlusCircle /> Novo Ticket</button>
                </Link>
              </div>
              <div>
                <strong><FaFilter /> Filtros</strong><br />
                <div className={styles.search}>
                  <input type="text" placeholder="Buscar" />
                  <div className={styles.value}>
                    <input type="checkbox" value="onlyMe" />
                    <label>Somente meus tickets</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ticketsArea}>
            {tickets.length > 0 ? (
              tickets.map(tkt => {
                return (
                  <TicketItem key={tkt.id} status={tkt.status.name} user={`${tkt.requester.name} ${tkt.requester.surname} (${tkt.requester.email})`} company={tkt.company.name} code={tkt.id} title={tkt.title} category={tkt.category.name} opendate={tkt.created_at} />
                )
              })
            ) : (
              <div className={styles.textNoneTicket}>
                <p>Não foram encontrados tickets</p>
              </div>
            )
            }
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

  const apiClient = clientAPIRequest(ctx)

  const { data } = await apiClient.get('/ticket');

  const ticketList = data.map(ticket => {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      created_at: format(parseISO(ticket.created_at), 'dd MMM yyyy HH:mm', { locale: ptBR }),
      requester: ticket.requester,
      status: ticket.status,
      company: ticket.company,
      category: ticket.category
    }

  })




  return {
    props: {
      tickets: ticketList
    }
  }
}
