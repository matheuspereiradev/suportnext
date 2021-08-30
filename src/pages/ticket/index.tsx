import { TicketItem } from "@components/ticketItem";
import { useAuth } from "@contexts/AuthContext";
import { useCategory } from "@contexts/CategoriesContext";
import { useStatus } from "@contexts/StatusContext";
import { Ticket } from "@interfaces/Ticket";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { clientAPIRequest } from '@services/api';
import styles from "@styles/ticket/index.module.scss";
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { GetServerSideProps } from "next";
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { useEffect, useState } from "react";
import { FaFilter, FaPlusCircle, FaSearch } from 'react-icons/fa';

interface TicketListPros {
  tickets: Array<Ticket>
}

export default function TicketList({ tickets }: TicketListPros) {

  const { user } = useAuth();
  const { status } = useStatus();
  const { categories } = useCategory();

  const [filterTickets, setFilterTickets] = useState<Array<Ticket>>(tickets)

  const [textFilter, setTextFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>(format(new Date().setDate(new Date().getDate() - 15), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [onlyMy, setOnlyMy] = useState<boolean>(false)
  // const [categoriesFilter, setCategoriesFilter] = useState<number[]>([])

  // const changeCategories = (e)=>{
  //   if(e.target.checked){
  //     setCategoriesFilter([...categoriesFilter,Number(e.target.value)])
  //   }else{
  //     setCategoriesFilter(categoriesFilter.filter(c=>c!==Number(e.target.value)))
  //   }
  // }

  function handleFilters() {
    setFilterTickets(tickets)

    setFilterTickets(tickets.filter(applyFilters))
  }

  const applyFilters = (tkt: Ticket) => {
    const endDateTomorrow = new Date(endDate).setDate(new Date(endDate).getDate() + 1);

    return (
      (new RegExp(textFilter, 'i').test(tkt.title) ||
        tkt.id == textFilter ||
        new RegExp(textFilter, 'i').test(tkt.requester.email) ||
        new RegExp(textFilter, 'i').test(tkt.company.name) ||
        new RegExp(textFilter, 'i').test(`${tkt.requester.name} ${tkt.requester.surname}`)
      ) && (onlyMy ? tkt.requester.id === user.id : true)
      && (new Date(tkt.created_at) >= new Date(startDate))
      && (new Date(tkt.created_at) < new Date(endDateTomorrow))
      // && (categoriesFilter.filter(c=>c==tkt.category.id).length > 0)
    )
  }

  useEffect(() => {
    handleFilters()
  }, [])

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
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value) }}
                    /><span> e </span>
                    <input type="date"
                      className={styles.dateField}
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value) }}
                    />
                  </div>
                  {/* <div className={styles.value}>
                    <strong>Status:</strong><br />
                    {
                      (status && (
                        status.map(stt => {
                          return (
                            <div key={stt.id}>
                              <label className={styles.withPointer} ><input type="checkbox"
                                // value={stt.id}
                                // onChange={() => { setOnlyMy(!onlyMy) }}
                                defaultChecked
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
                                // value={cat.id}
                                // onChange={(e)=>{changeCategories(e)}}
                                defaultChecked
                              /> {cat.name}</label><br />
                            </div>
                          )
                        })
                      ))
                    }
                  </div>*/}
                </div>
              </div>

            </div>
          </div>
          <div className={styles.ticketsArea}>
            <p style={{ float: "right" }}><strong>{filterTickets.length}-{tickets.length}</strong></p>
            <br />
            {filterTickets.length > 0 ? (
              filterTickets.map(tkt => {
                return (
                  <TicketItem key={tkt.id} icon={tkt.status.icon} status={tkt.status.name} user={`${tkt.requester.name} ${tkt.requester.surname} (${tkt.requester.email})`} company={tkt.company.name} code={tkt.id} title={tkt.title} category={tkt.category.name} opendate={tkt.formated_created_at} />
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
      formated_created_at: format(parseISO(ticket.created_at), 'dd MMM yyyy HH:mm', { locale: ptBR }),
      created_at: ticket.created_at,
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
