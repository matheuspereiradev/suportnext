import Link from 'next/link'
import { GetServerSideProps } from "next";
import { TicketItem } from "@components/ticketItem";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/ticket/index.module.scss";
import { parseCookies } from 'nookies';
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { clientAPIRequest } from '@services/api';
import { FaFilter, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { Ticket } from "@interfaces/Ticket";
import { useState } from "react";
import { useStatus } from "@contexts/StatusContext";
import { useCategory } from "@contexts/CategoriesContext";
import { DefaultLayout } from "@layouts/DefaultLayout";

interface TicketListPros {
  tickets: Array<Ticket>
}

export default function TicketList({ tickets }: TicketListPros) {

  const { user } = useAuth();
  const { status } = useStatus();
  const { categories } = useCategory();
  const [filterTickets, setFilterTickets] = useState<Array<Ticket>>(tickets)
  const [textFilter, setTextFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>(new Date)

  const [onlyMy, setOnlyMy] = useState<boolean>(false)

  function handleFilters() {
    setFilterTickets(tickets)

    setFilterTickets(tickets.filter(applyFilters))
  }

  const applyFilters = (tkt: Ticket) => {
    return (
      (new RegExp(textFilter, 'i').test(tkt.title) ||
        tkt.id == textFilter ||
        new RegExp(textFilter, 'i').test(tkt.requester.email) ||
        new RegExp(textFilter, 'i').test(tkt.company.name) ||
        new RegExp(textFilter, 'i').test(`${tkt.requester.name} ${tkt.requester.surname}`)
      ) && (onlyMy ? tkt.requester.id === user.id : true)

    )
  }

  return (
    <DefaultLayout titleKey="tickets">
      <main className={styles.container}>
        <div>
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
                <button className={styles.buttonAddTicket} onClick={() => { handleFilters() }}><FaSearch /> Pesquisar</button>
              </div>
              <div>
                <strong><FaFilter /> Filtros</strong><br />
                <div className={styles.search}>
                  <input type="text" placeholder="Buscar (Cód, titulo, solicitante, empresa...)" value={textFilter} onChange={
                    event => {
                      setTextFilter(event.target.value);
                    }
                  } />
                  <div className={styles.value}>
                    <label className={styles.withPointer}><input type="checkbox"
                      checked={onlyMy}
                      onChange={() => { setOnlyMy(!onlyMy) }}
                    /> Somente meus tickets</label>
                  </div>
                  <div className={styles.value}>
                    <label>Entre:</label><br />
                    <input type="date"
                      className={styles.dateField}
                    /> <span>e</span> <input type="date" className={styles.dateField} />
                  </div>
                  <div className={styles.value}>
                    <strong>Status:</strong><br />
                    {
                      (status && (
                        status.map(stt => {
                          return (
                            <div key={stt.id}>
                              <label className={styles.withPointer} ><input type="checkbox"
                                checked={onlyMy}
                                onChange={() => { setOnlyMy(!onlyMy) }}
                              /><img className={styles.ico} src={stt.icon} /> {stt.name}</label><br />
                            </div>
                          )
                        })
                      ))
                    }
                  </div>
                  <div className={styles.value}>
                    <strong>Categorias:</strong><br />
                    {
                      (categories && (
                        categories.map(cat => {
                          return (
                            <div key={cat.id}>
                              <label className={styles.withPointer}><input type="checkbox"
                                checked={onlyMy}
                                onChange={() => { setOnlyMy(!onlyMy) }}
                              /> {cat.name}</label><br />
                            </div>
                          )
                        })
                      ))
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className={styles.ticketsArea}>
            {filterTickets.length > 0 ? (
              filterTickets.map(tkt => {
                return (
                  <TicketItem key={tkt.id} icon={tkt.status.icon} status={tkt.status.name} user={`${tkt.requester.name} ${tkt.requester.surname} (${tkt.requester.email})`} company={tkt.company.name} code={tkt.id} title={tkt.title} category={tkt.category.name} opendate={tkt.created_at} />
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
