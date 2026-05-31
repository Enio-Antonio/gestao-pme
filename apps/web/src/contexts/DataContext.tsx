import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Receita {
  id: number
  descricao: string
  valor: number
  data: string
  status: 'Recebido' | 'Pendente'
}

export interface Despesa {
  id: number
  descricao: string
  valor: number
  data: string
  categoria: string
}

export interface Projeto {
  id: number
  nome: string
  cliente: string
  responsavel: string
  inicio: string
  prazo: string
  status: 'Planejado' | 'Em andamento' | 'Concluído' | 'Atrasado'
  progresso: number
  diasRestantes: number
}

export interface Lead {
  id: number
  empresa: string
  contato: string
  valor: number
  responsavel: string
  etapa: 'Novo Lead' | 'Contato Realizado' | 'Proposta Enviada' | 'Negociação' | 'Fechado' | 'Perdido'
  ultimaInteracao: string
}

export interface Meta {
  id: number
  meta: string
  prazo: string
  progresso: number
  status: 'Planejado' | 'Em andamento' | 'Concluído'
}

export interface Requisicao {
  id: number
  tipo: 'Sugestão' | 'Reclamação' | 'Elogio'
  mensagem: string
  data: string
}

interface DataContextType {
  receitas: Receita[]
  despesas: Despesa[]
  projetos: Projeto[]
  leads: Lead[]
  metas: Meta[]
  requisicoes: Requisicao[]
  addReceita: (r: Omit<Receita, 'id'>) => void
  updateReceita: (id: number, r: Partial<Receita>) => void
  deleteReceita: (id: number) => void
  addDespesa: (d: Omit<Despesa, 'id'>) => void
  updateDespesa: (id: number, d: Partial<Despesa>) => void
  deleteDespesa: (id: number) => void
  addProjeto: (p: Omit<Projeto, 'id'>) => void
  updateProjeto: (id: number, p: Partial<Projeto>) => void
  addLead: (l: Omit<Lead, 'id'>) => void
  updateLead: (id: number, l: Partial<Lead>) => void
  addMeta: (m: Omit<Meta, 'id'>) => void
  updateMeta: (id: number, m: Partial<Meta>) => void
  addRequisicao: (r: Omit<Requisicao, 'id'>) => void
}

const DataContext = createContext<DataContextType | null>(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

const initialReceitas: Receita[] = [
  { id: 1, descricao: 'Projeto Website Cliente A', valor: 15000, data: '2024-06-01', status: 'Recebido' },
  { id: 2, descricao: 'Consultoria Mensal', valor: 8000, data: '2024-06-05', status: 'Recebido' },
  { id: 3, descricao: 'Desenvolvimento App Mobile', valor: 25000, data: '2024-06-15', status: 'Pendente' },
  { id: 4, descricao: 'Suporte Técnico Q2', valor: 4500, data: '2024-06-20', status: 'Pendente' },
]

const initialDespesas: Despesa[] = [
  { id: 1, descricao: 'Salários e Encargos', valor: 18000, data: '2024-06-05', categoria: 'Pessoal' },
  { id: 2, descricao: 'Aluguel Escritório', valor: 3500, data: '2024-06-01', categoria: 'Fixo' },
  { id: 3, descricao: 'Ferramentas SaaS', valor: 1200, data: '2024-06-10', categoria: 'Operacional' },
  { id: 4, descricao: 'Marketing Digital', valor: 2500, data: '2024-06-12', categoria: 'Marketing' },
]

const initialProjetos: Projeto[] = [
  { id: 1, nome: 'Website Corporativo', cliente: 'Empresa ABC', responsavel: 'João Silva', inicio: '2024-05-01', prazo: '2024-06-30', status: 'Em andamento', progresso: 75, diasRestantes: 10 },
  { id: 2, nome: 'App Mobile E-commerce', cliente: 'Loja XYZ', responsavel: 'Maria Santos', inicio: '2024-04-01', prazo: '2024-07-31', status: 'Em andamento', progresso: 45, diasRestantes: 41 },
  { id: 3, nome: 'Sistema ERP', cliente: 'Indústria 123', responsavel: 'Pedro Costa', inicio: '2024-06-01', prazo: '2024-09-30', status: 'Planejado', progresso: 10, diasRestantes: 102 },
]

const initialLeads: Lead[] = [
  { id: 1, empresa: 'Startup Tech', contato: 'Carlos Mendes', valor: 45000, responsavel: 'Ana Lima', etapa: 'Proposta Enviada', ultimaInteracao: '2024-06-18' },
  { id: 2, empresa: 'Comércio Local', contato: 'Fernanda Rocha', valor: 12000, responsavel: 'João Silva', etapa: 'Negociação', ultimaInteracao: '2024-06-20' },
  { id: 3, empresa: 'Consultoria RH', contato: 'Roberto Alves', valor: 28000, responsavel: 'Maria Santos', etapa: 'Contato Realizado', ultimaInteracao: '2024-06-15' },
  { id: 4, empresa: 'Indústria Sul', contato: 'Paula Nunes', valor: 80000, responsavel: 'Pedro Costa', etapa: 'Novo Lead', ultimaInteracao: '2024-06-21' },
]

const initialMetas: Meta[] = [
  { id: 1, meta: 'Aumentar receita em 20% no Q3', prazo: '2024-09-30', progresso: 35, status: 'Em andamento' },
  { id: 2, meta: 'Reduzir custos operacionais em 10%', prazo: '2024-08-31', progresso: 60, status: 'Em andamento' },
  { id: 3, meta: 'Contratar 2 desenvolvedores', prazo: '2024-07-31', progresso: 50, status: 'Em andamento' },
]

const initialRequisicoes: Requisicao[] = [
  { id: 1, tipo: 'Sugestão', mensagem: 'Implementar relatórios em PDF', data: '2024-06-10' },
  { id: 2, tipo: 'Elogio', mensagem: 'Ótimo atendimento da equipe de suporte', data: '2024-06-15' },
]

function makeId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [receitas, setReceitas] = useState<Receita[]>(initialReceitas)
  const [despesas, setDespesas] = useState<Despesa[]>(initialDespesas)
  const [projetos, setProjetos] = useState<Projeto[]>(initialProjetos)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [metas, setMetas] = useState<Meta[]>(initialMetas)
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(initialRequisicoes)

  const addReceita = (r: Omit<Receita, 'id'>) => setReceitas(prev => [...prev, { ...r, id: makeId(prev) }])
  const updateReceita = (id: number, r: Partial<Receita>) => setReceitas(prev => prev.map(x => x.id === id ? { ...x, ...r } : x))
  const deleteReceita = (id: number) => setReceitas(prev => prev.filter(x => x.id !== id))

  const addDespesa = (d: Omit<Despesa, 'id'>) => setDespesas(prev => [...prev, { ...d, id: makeId(prev) }])
  const updateDespesa = (id: number, d: Partial<Despesa>) => setDespesas(prev => prev.map(x => x.id === id ? { ...x, ...d } : x))
  const deleteDespesa = (id: number) => setDespesas(prev => prev.filter(x => x.id !== id))

  const addProjeto = (p: Omit<Projeto, 'id'>) => setProjetos(prev => [...prev, { ...p, id: makeId(prev) }])
  const updateProjeto = (id: number, p: Partial<Projeto>) => setProjetos(prev => prev.map(x => x.id === id ? { ...x, ...p } : x))

  const addLead = (l: Omit<Lead, 'id'>) => setLeads(prev => [...prev, { ...l, id: makeId(prev) }])
  const updateLead = (id: number, l: Partial<Lead>) => setLeads(prev => prev.map(x => x.id === id ? { ...x, ...l } : x))

  const addMeta = (m: Omit<Meta, 'id'>) => setMetas(prev => [...prev, { ...m, id: makeId(prev) }])
  const updateMeta = (id: number, m: Partial<Meta>) => setMetas(prev => prev.map(x => x.id === id ? { ...x, ...m } : x))

  const addRequisicao = (r: Omit<Requisicao, 'id'>) =>
    setRequisicoes(prev => [...prev, { ...r, id: makeId(prev), data: new Date().toISOString().split('T')[0] }])

  return (
    <DataContext.Provider value={{
      receitas, despesas, projetos, leads, metas, requisicoes,
      addReceita, updateReceita, deleteReceita,
      addDespesa, updateDespesa, deleteDespesa,
      addProjeto, updateProjeto,
      addLead, updateLead,
      addMeta, updateMeta,
      addRequisicao,
    }}>
      {children}
    </DataContext.Provider>
  )
}
