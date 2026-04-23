import React, { useState } from 'react'
import {Calendar, Target, MessageSquare, Plus, Edit2, X} from 'lucide-react'
import { useData, Meta, Requisicao } from '@/contexts/DataContext'

const Estrategia = () => {
  const { metas, requisicoes, addMeta, updateMeta, addRequisicao } = useData()
  
  const [showMetaModal, setShowMetaModal] = useState(false)
  const [showReqModal, setShowReqModal] = useState(false)
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null)
  const [metaForm, setMetaForm] = useState({ meta: '', prazo: '', progresso: 0, status: 'Planejado' as Meta['status'] })
  const [reqForm, setReqForm] = useState({ tipo: 'Sugestão' as Requisicao['tipo'], mensagem: '' })

  const cronograma = [
    {
      id: 1,
      titulo: 'Lançamento Nova Funcionalidade',
      area: 'Desenvolvimento',
      inicio: '2024-06-01',
      fim: '2024-06-30',
      status: 'Em andamento',
      progresso: 65,
    },
    {
      id: 2,
      titulo: 'Campanha Marketing Digital Q2',
      area: 'Marketing',
      inicio: '2024-06-10',
      fim: '2024-07-10',
      status: 'Em andamento',
      progresso: 40,
    },
    {
      id: 3,
      titulo: 'Expansão Equipe Comercial',
      area: 'Negócios',
      inicio: '2024-07-01',
      fim: '2024-08-01',
      status: 'Planejado',
      progresso: 0,
    },
  ]

  const tarefas = [
    { id: 1, tarefa: 'Implementar dashboard de métricas', area: 'Desenvolvimento', responsavel: 'João Silva', prazo: '2024-06-25', status: 'Em andamento' },
    { id: 2, tarefa: 'Criar conteúdo para blog', area: 'Marketing', responsavel: 'Maria Santos', prazo: '2024-06-20', status: 'Concluído' },
    { id: 3, tarefa: 'Prospectar novos clientes', area: 'Negócios', responsavel: 'Pedro Costa', prazo: '2024-06-30', status: 'Em andamento' },
    { id: 4, tarefa: 'Revisar processos internos', area: 'Operacional', responsavel: 'Ana Lima', prazo: '2024-07-05', status: 'Pendente' },
  ]

  const openMetaModal = (meta?: Meta) => {
    if (meta) {
      setEditingMeta(meta)
      setMetaForm({ meta: meta.meta, prazo: meta.prazo, progresso: meta.progresso, status: meta.status })
    } else {
      setEditingMeta(null)
      setMetaForm({ meta: '', prazo: '', progresso: 0, status: 'Planejado' })
    }
    setShowMetaModal(true)
  }

  const handleMetaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMeta) {
      updateMeta(editingMeta.id, metaForm)
    } else {
      addMeta(metaForm)
    }
    setShowMetaModal(false)
    setEditingMeta(null)
  }

  const handleReqSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addRequisicao(reqForm)
    setShowReqModal(false)
    setReqForm({ tipo: 'Sugestão', mensagem: '' })
  }

  const changeMetaStatus = (id: number, status: Meta['status']) => {
    const newProgresso = status === 'Concluído' ? 100 : status === 'Em andamento' ? 50 : 0
    updateMeta(id, { status, progresso: newProgresso })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estratégia</h1>
          <p className="text-gray-600 mt-1">Planejamento e gestão interna da empresa</p>
        </div>
        <button 
          onClick={() => openMetaModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      {/* Cronograma */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Cronograma de Atividades</h2>
        </div>
        <div className="space-y-4">
          {cronograma.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{item.titulo}</h3>
                  <p className="text-sm text-gray-600">
                    {item.inicio} até {item.fim}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'Em andamento'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {item.area}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.progresso}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.progresso}% concluído</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tarefas por Área */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tarefas por Área</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Tarefa</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Área</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Responsável</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Prazo</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tarefas.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.tarefa}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {item.area}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.responsavel}</td>
                  <td className="py-3 px-4 text-gray-600">{item.prazo}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === 'Concluído'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Em andamento'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metas e Requisições */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metas */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Metas e Planos</h2>
            </div>
          </div>
          <div className="space-y-4">
            {metas.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-lg group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1">{item.meta}</h3>
                  <button
                    onClick={() => openMetaModal(item)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Prazo: {item.prazo}</p>
                  <select
                    value={item.status}
                    onChange={(e) => changeMetaStatus(item.id, e.target.value as Meta['status'])}
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planejado">Planejado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.progresso}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.progresso}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requisições Anônimas */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Requisições Anônimas</h2>
            </div>
            <button 
              onClick={() => setShowReqModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Nova Requisição
            </button>
          </div>
          <div className="space-y-3">
            {requisicoes.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.tipo === 'Sugestão'
                        ? 'bg-green-100 text-green-700'
                        : item.tipo === 'Problema'
                        ? 'bg-red-100 text-red-700'
                        : item.tipo === 'Gargalo'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.tipo}
                  </span>
                  <span className="text-xs text-gray-500">{item.data}</span>
                </div>
                <p className="text-sm text-gray-700">{item.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Modal */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMeta ? 'Editar Meta' : 'Nova Meta'}
              </h3>
              <button onClick={() => setShowMetaModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMetaSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta</label>
                <input
                  type="text"
                  value={metaForm.meta}
                  onChange={(e) => setMetaForm({ ...metaForm, meta: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prazo</label>
                <input
                  type="text"
                  placeholder="Ex: Q3 2024"
                  value={metaForm.prazo}
                  onChange={(e) => setMetaForm({ ...metaForm, prazo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progresso (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={metaForm.progresso}
                  onChange={(e) => setMetaForm({ ...metaForm, progresso: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={metaForm.status}
                  onChange={(e) => setMetaForm({ ...metaForm, status: e.target.value as Meta['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Planejado">Planejado</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMetaModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requisição Modal */}
      {showReqModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Nova Requisição Anônima</h3>
              <button onClick={() => setShowReqModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReqSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={reqForm.tipo}
                  onChange={(e) => setReqForm({ ...reqForm, tipo: e.target.value as Requisicao['tipo'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Sugestão">Sugestão</option>
                  <option value="Problema">Problema</option>
                  <option value="Gargalo">Gargalo</option>
                  <option value="Capacitação">Capacitação</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea
                  value={reqForm.mensagem}
                  onChange={(e) => setReqForm({ ...reqForm, mensagem: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Estrategia