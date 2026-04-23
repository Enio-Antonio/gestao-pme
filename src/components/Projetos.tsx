import React, { useState } from 'react'
import {Briefcase, Plus, Clock, AlertCircle, Edit2, X} from 'lucide-react'
import { useData, Projeto } from '@/contexts/DataContext'

const Projetos = () => {
  const { projetos, addProjeto, updateProjeto } = useData()
  
  const [showModal, setShowModal] = useState(false)
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    cliente: '',
    responsavel: '',
    inicio: '',
    prazo: '',
    status: 'Planejado' as Projeto['status'],
    progresso: 0,
    diasRestantes: 0
  })

  const openModal = (projeto?: Projeto) => {
    if (projeto) {
      setEditingProjeto(projeto)
      setFormData(projeto)
    } else {
      setEditingProjeto(null)
      setFormData({
        nome: '',
        cliente: '',
        responsavel: '',
        inicio: new Date().toISOString().split('T')[0],
        prazo: '',
        status: 'Planejado',
        progresso: 0,
        diasRestantes: 30
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProjeto(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProjeto) {
      updateProjeto(editingProjeto.id, formData)
    } else {
      addProjeto(formData)
    }
    closeModal()
  }

  const handleProgressChange = (id: number, progresso: number) => {
    let status: Projeto['status'] = 'Em andamento'
    if (progresso === 0) status = 'Planejado'
    if (progresso === 100) status = 'Concluído'
    
    updateProjeto(id, { progresso, status })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Em andamento':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Atrasado':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Planejado':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const stats = [
    { label: 'Total de Projetos', value: projetos.length, color: 'blue' },
    {
      label: 'Em Andamento',
      value: projetos.filter((p) => p.status === 'Em andamento').length,
      color: 'blue',
    },
    {
      label: 'Atrasados',
      value: projetos.filter((p) => p.status === 'Atrasado').length,
      color: 'red',
    },
    {
      label: 'Concluídos',
      value: projetos.filter((p) => p.status === 'Concluído').length,
      color: 'green',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">Acompanhamento de serviços e projetos da empresa</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p
              className={`text-4xl font-bold ${
                stat.color === 'blue'
                  ? 'text-blue-600'
                  : stat.color === 'red'
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projetos.map((projeto) => (
          <div
            key={projeto.id}
            className={`bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all ${getStatusColor(
              projeto.status
            )}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{projeto.nome}</h3>
                  <p className="text-sm text-gray-600">{projeto.cliente}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    projeto.status === 'Concluído'
                      ? 'bg-green-100 text-green-700'
                      : projeto.status === 'Em andamento'
                      ? 'bg-blue-100 text-blue-700'
                      : projeto.status === 'Atrasado'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {projeto.status}
                </span>
                <button
                  onClick={() => openModal(projeto)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Responsável:</span>
                <span className="font-medium text-gray-900">{projeto.responsavel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Início:</span>
                <span className="text-gray-900">{projeto.inicio}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Prazo:</span>
                <span className="text-gray-900">{projeto.prazo}</span>
              </div>
            </div>

            {/* Alert */}
            {projeto.diasRestantes < 7 && projeto.diasRestantes > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <Clock className="text-yellow-600" size={18} />
                <p className="text-sm text-yellow-700">
                  Prazo próximo: {projeto.diasRestantes} dias restantes
                </p>
              </div>
            )}

            {projeto.diasRestantes < 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="text-red-600" size={18} />
                <p className="text-sm text-red-700">
                  Atrasado em {Math.abs(projeto.diasRestantes)} dias
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso</span>
                <span className="text-sm font-bold text-gray-900">{projeto.progresso}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={projeto.progresso}
                onChange={(e) => handleProgressChange(projeto.id, parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${
                    projeto.progresso === 100 ? '#10b981' : projeto.status === 'Atrasado' ? '#ef4444' : '#2563eb'
                  } 0%, ${
                    projeto.progresso === 100 ? '#10b981' : projeto.status === 'Atrasado' ? '#ef4444' : '#2563eb'
                  } ${projeto.progresso}%, #e5e7eb ${projeto.progresso}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProjeto ? 'Editar Projeto' : 'Novo Projeto'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={formData.inicio}
                    onChange={(e) => setFormData({ ...formData, inicio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prazo</label>
                  <input
                    type="date"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Projeto['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Planejado">Planejado</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Atrasado">Atrasado</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progresso (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progresso}
                  onChange={(e) => setFormData({ ...formData, progresso: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
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
    </div>
  )
}

export default Projetos