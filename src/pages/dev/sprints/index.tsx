import { SprintItem } from "@components/sprintItem";
import { useAuth } from "@contexts/AuthContext";
import { useCategory } from "@contexts/CategoriesContext";
import { useStatus } from "@contexts/StatusContext";
import { useToast } from "@contexts/ToastContext";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { LayoutCloseButton } from "@layouts/LayoutCloseButton";
import { browserAPIRequest, clientAPIRequest } from '@services/api';
import styles from "@styles/dev/sprints/index.module.scss";
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { parseCookies } from 'nookies';
import { useState } from "react";

interface Sprint {
  id: number,
  name: string,
  isOpen: boolean,
  startDate: Date,
  expectedEndDate: Date,
  formated_created_at: Date,
  created_at: Date
}

interface SprintListPros {
  sprints: Array<Sprint>
}

export default function SprintList({ sprints }: SprintListPros) {

  const [filterSprints, setFilterSprints] = useState<Array<Sprint>>(sprints)
  const { addToast } = useToast();

  const deleteFunction = async (id: number) => {
    if (confirm(`deseja realmente excluir a sprint ${id}?`)) {
      try {
        const res = await browserAPIRequest.delete(`/sprint/${id}`);
        addToast({ title: "Sucesso", description: "Excluido com sucesso", type: "success" })
      } catch (e) {
        addToast({ title: "Erro", description: "Erro ao excluir a sprint", type: "error" })
      }
    }
  }

  return (
    <LayoutCloseButton titleKey="Sprints">
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Sprints</h1>
          <Link href='/dev/sprints/cadastrar'>
            <button className={styles.newSprintButton}>Nova Sprint</button>
          </Link>

        </div>
        <div className={styles.content}>
          {filterSprints.length > 0 ? (
            filterSprints.map(sprint => {
              return (
                <SprintItem key={sprint.id}
                  expectedEndDate={sprint.expectedEndDate}
                  isOpen={sprint.isOpen}
                  id={sprint.id}
                  name={sprint.name}
                  startDate={sprint.startDate}
                  deleteFunction={async () => deleteFunction(sprint.id)}
                />
              )
            })
          ) : (
            <div className={styles.textNoneTicket}>
              <p>Não foram encontradas sprints</p>
            </div>
          )
          }

        </div>
      </main>

    </LayoutCloseButton>
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

  const { data } = await apiClient.get('/sprint');

  const sprintList = data.map(sprint => {
    return {
      id: sprint.id,
      name: sprint.name,
      isOpen: sprint.isOpen,
      startDate: format(parseISO(sprint.startDate), 'dd MMM yyyy', { locale: ptBR }),
      expectedEndDate: format(parseISO(sprint.expectedEndDate), 'dd MMM yyyy', { locale: ptBR }),
      formated_created_at: format(parseISO(sprint.created_at), 'dd MMM yyyy', { locale: ptBR }),
      created_at: sprint.created_at,
    }

  })

  return {
    props: {
      sprints: sprintList
    }
  }
}
