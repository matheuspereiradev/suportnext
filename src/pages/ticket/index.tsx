import Head from "next/head";
import { TicketItem } from "../../components/ticketItem";
import styles from "../../styles/ticket/index.module.scss"

export default function Home() {
  return (
    <>
    <Head>
      <title>WA Suporte - Tickets</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="copyright" content="HAILE" />
      <meta name="language" content="PT-BR" />
      <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com"/>
      <meta name="keywords" content="imoveis,imóveis,casa,comprar,haile,corretor,corretores,apartamentos,aluguel,arrendatar,casas"/>
    </Head>
    <main className={styles.content}>
      <h1>Tickets</h1>
      <br/>

      <TicketItem status={"em andamento"} user={"matheus"} company = {"wa"} code={"123"} title={"corrigir adu"} category = {"Correção de bugs"} opendate={"2020 05 04 20:00:00"}/>
      <TicketItem status={"em andamento"} user={"matheus"} company = {"wa"} code={"123"} title={"corrigir adu"} category = {"Correção de bugs"} opendate={"2020 05 04 20:00:00"}/>
      <TicketItem status={"em andamento"} user={"matheus"} company = {"wa"} code={"123"} title={"corrigir adu"} category = {"Correção de bugs"} opendate={"2020 05 04 20:00:00"}/>

      
    </main>

  </>
  )
}
