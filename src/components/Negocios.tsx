import React, { useState, useMemo } from 'react'
import {Users, Plus, TrendingUp, DollarSign, Edit2, X} from 'lucide-react'
import { useData, Lead } from '@/contexts/DataContext'

const Negocios = () => {
  const { leads, addLead, updateLead } = useData()
  
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState({
    empresa: '',
    contato: '',
    valor: '',
    responsavel: '',
    etapa: 'Novo Lead' as Lead['etapa'],
    ultimaInteracao: new Date().toISOString().split('T')[0]
  })

  const etapas: Lead['etapa'][] = ['Novo Lead', 'Contato Realizado', 'Proposta Enviada', 'Negociação', 'Fechado', 'Perdido']

  const funil = useMemo(() => {
    return etapas.map(etapa => ({
      etapa,
      leads: leads.filter(l => l.etapa === etapa),
      total: leads.filter(l => l.etapa === etapa).length,
      cor: etapa === 'Novo Lead' ? 'bg-gray-500' :
           etapa === 'Contato Realizado' ? 'bg-blue-500' :
           etapa === 'Proposta Enviada' ? 'bg-purple-500' :
           etapa === 'Negociação' ? 'bg-yellow-500' :
           etapa === 'Fechado' ? 'bg-green-500' : 'bg-red-500'
    }))
  }, [leads])

  const valorTotal = useMemo(() => leads.reduce((sum, lead) => sum + lead.valor, 0), [leads])
  const leadsAtivos = useMemo(() => 
    leads.filter((lead) => lead.etapa !== 'Fechado' && lead.etapa !== 'Perdido').length,
    [leads]
  )

  const openModal = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead)
      setFormData({
        empresa: lead.empresa,
        contato: lead.contato,
        valor: lead.valor.toString(),
        responsavel: lead.responsavel,
        etapa: lead.etapa,
        ultimaInteracao: lead.ultimaInteracao
      })
    } else {
      setEditingLead(null)
      setFormData({
        empresa: '',
        contato: '',
        valor: '',
        responsavel: '',
        etapa: 'Novo Lead',
        ultimaInteracao: new Date().toISOString().split('T')[0]
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingLead(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const leadData = {
      ...formData,
      valor: parseFloat(formData.valor)
    }
    
    if (editingLead) {
      updateLead(editingLead.id, leadData)
    } else {
      addLead(leadData)
    }
    closeModal()
  }

  const moveLeadToStage = (leadId: number, newEtapa: Lead['etapa']) => {
    updateLead(leadId, { etapa: newEtapa, ultimaInteracao: new Date().toISOString().split('T')[0] })
  }

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'Novo Lead':
        return 'bg-gray-100 text-gray-700'
      case 'Contato Realizado':
        return 'bg-blue-100 text-blue-700'
      case 'Proposta Enviada':
        return 'bg-purple-100 text-purple-700'
      case 'Negociação':
        return 'bg-yellow-100 text-yellow-700'
      case 'Fechado':
        return 'bg-green-100 text-green-700'
      case 'Perdido':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Negócios</h1>
          <p className="text-gray-600 mt-1">Gestão comercial e funil de vendas</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Leads Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{leadsAtivos}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Valor Total em Pipeline</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ {valorTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Taxa de Conversão</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {leads.length > 0 ? Math.round((funil.find(f => f.etapa === 'Fechado')?.total || 0) / leads.length * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Funil de Vendas - Kanban */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Funil de Vendas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {funil.map((column) => (
            <div key={column.etapa} className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">{column.etapa}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {column.total}
                </span>
              </div>
              <div className="space-y-3">
                {column.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 text-sm">{lead.empresa}</p>
                      <button
                        onClick={() => openModal(lead)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={14} className="text-gray-600" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{lead.contato.split(' - ')[0]}</p>
                    <p className="text-sm font-bold text-green-600 mb-2">
                      R$ {lead.valor.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{lead.responsavel}</p>
                    <select
                      value={lead.etapa}
                      onChange={(e) => moveLeadToStage(lead.id, e.target.value as Lead['etapa'])}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {etapas.map(etapa => (
                        <option key={etapa} value={etapa}>{etapa}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Lista de Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Empresa</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Contato</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Valor Potencial</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Responsável</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Etapa</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Última Interação</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{lead.empresa}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{lead.contato}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-green-600">R$ {lead.valor.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{lead.responsavel}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEtapaColor(lead.etapa)}`}>
                      {lead.etapa}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{lead.ultimaInteracao}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => openModal(lead)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contato</label>
                <input
                  type="text"
                  placeholder="Nome - email@exemplo.com"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor Potencial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etapa</label>
                <select
                  value={formData.etapa}
                  onChange={(e) => setFormData({ ...formData, etapa: e.target.value as Lead['etapa'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {etapas.map(etapa => (
                    <option key={etapa} value={etapa}>{etapa}</option>
                  ))}
                </select>
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

export default Negocios