import React, { useState, useMemo } from 'react'
import {TrendingUp, TrendingDown, Plus, Edit2, Trash2, X, Sparkles, Lightbulb} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useData, Receita, Despesa } from '@/contexts/DataContext'
import { lumi } from '@/lib/lumi'

const Financeiro = () => {
  const { receitas, despesas, addReceita, updateReceita, deleteReceita, addDespesa, updateDespesa, deleteDespesa } = useData()
  
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'receita' | 'despesa'>('receita')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    statusOrCategoria: ''
  })

  // Planejamento Financeiro state
  const [showPlanejamento, setShowPlanejamento] = useState(false)
  const [planejamentoForm, setPlanejamentoForm] = useState({
    metasEmpresa: '',
    periodoAnalise: 'Últimos 6 meses',
    detalhesAdicionais: ''
  })
  const [planejamentoResult, setPlanejamentoResult] = useState('')
  const [loadingPlanejamento, setLoadingPlanejamento] = useState(false)

  const totalReceitas = useMemo(() => receitas.reduce((sum, r) => sum + r.valor, 0), [receitas])
  const totalDespesas = useMemo(() => despesas.reduce((sum, d) => sum + d.valor, 0), [despesas])
  const saldo = totalReceitas - totalDespesas

  const chartData = [
    { month: 'Jan', receitas: 45000, despesas: 28000 },
    { month: 'Fev', receitas: 52000, despesas: 31000 },
    { month: 'Mar', receitas: 48000, despesas: 29000 },
    { month: 'Abr', receitas: 61000, despesas: 33000 },
    { month: 'Mai', receitas: 55000, despesas: 30000 },
    { month: 'Jun', receitas: totalReceitas, despesas: totalDespesas },
  ]

  const servicos = [
    { id: 1, servico: 'AWS Cloud Hosting', fornecedor: 'Amazon', valor: 850, recorrencia: 'Mensal' },
    { id: 2, servico: 'Google Workspace', fornecedor: 'Google', valor: 180, recorrencia: 'Mensal' },
    { id: 3, servico: 'Figma Professional', fornecedor: 'Figma', valor: 120, recorrencia: 'Mensal' },
    { id: 4, servico: 'Contador', fornecedor: 'Contabilidade XYZ', valor: 800, recorrencia: 'Mensal' },
  ]

  const openModal = (type: 'receita' | 'despesa', item?: Receita | Despesa) => {
    setModalType(type)
    if (item) {
      setEditingId(item.id)
      setFormData({
        descricao: item.descricao,
        valor: item.valor.toString(),
        data: item.data,
        statusOrCategoria: type === 'receita' ? (item as Receita).status : (item as Despesa).categoria
      })
    } else {
      setEditingId(null)
      setFormData({
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        statusOrCategoria: type === 'receita' ? 'Pendente' : 'Operacional'
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ descricao: '', valor: '', data: '', statusOrCategoria: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const valor = parseFloat(formData.valor)
    
    if (modalType === 'receita') {
      if (editingId) {
        updateReceita(editingId, {
          descricao: formData.descricao,
          valor,
          data: formData.data,
          status: formData.statusOrCategoria as 'Recebido' | 'Pendente'
        })
      } else {
        addReceita({
          descricao: formData.descricao,
          valor,
          data: formData.data,
          status: formData.statusOrCategoria as 'Recebido' | 'Pendente'
        })
      }
    } else {
      if (editingId) {
        updateDespesa(editingId, {
          descricao: formData.descricao,
          valor,
          data: formData.data,
          categoria: formData.statusOrCategoria
        })
      } else {
        addDespesa({
          descricao: formData.descricao,
          valor,
          data: formData.data,
          categoria: formData.statusOrCategoria
        })
      }
    }
    closeModal()
  }

  const handleDelete = (type: 'receita' | 'despesa', id: number) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      type === 'receita' ? deleteReceita(id) : deleteDespesa(id)
    }
  }

  const handleGerarPlanejamento = async () => {
    setLoadingPlanejamento(true)
    setPlanejamentoResult('')

    try {
      const result = await lumi.functions.invoke('planejamentoFinanceiro', {
        method: 'POST',
        body: {
          receitasTotal: totalReceitas,
          despesasTotal: totalDespesas,
          saldo,
          metasEmpresa: planejamentoForm.metasEmpresa,
          periodoAnalise: planejamentoForm.periodoAnalise,
          detalhesAdicionais: planejamentoForm.detalhesAdicionais
        }
      })

      setPlanejamentoResult(result.planejamento)
    } catch (error: any) {
      const errorMessage = error?.data?.error || 'Erro ao gerar planejamento financeiro'
      alert(errorMessage)
      console.error('Erro:', error)
    } finally {
      setLoadingPlanejamento(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">Gestão completa das finanças da empresa</p>
        </div>
        <button
          onClick={() => setShowPlanejamento(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Sparkles size={20} />
          Planejamento com IA
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Receitas Totais</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ {totalReceitas.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">+12% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Despesas Totais</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ {totalDespesas.toLocaleString()}</p>
          <p className="text-sm text-red-600 mt-2">-5% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Saldo Atual</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ {saldo.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-2">+18% vs mês anterior</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Evolução Financeira</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesas" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Receitas */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Receitas</h2>
            <button
              onClick={() => openModal('receita')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {receitas.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.descricao}</p>
                  <p className="text-sm text-gray-600">{item.data}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {item.valor.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.status === 'Recebido'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('receita', item)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete('receita', item.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Despesas</h2>
            <button
              onClick={() => openModal('despesa')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {despesas.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.descricao}</p>
                  <p className="text-sm text-gray-600">{item.data}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-red-600">R$ {item.valor.toLocaleString()}</p>
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {item.categoria}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('despesa', item)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete('despesa', item.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Serviços Terceirizados */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Serviços Terceirizados</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Serviço</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Fornecedor</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Valor</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Recorrência</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.servico}</td>
                  <td className="py-3 px-4 text-gray-600">{item.fornecedor}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">R$ {item.valor}</td>
                  <td className="py-3 px-4 text-gray-600">{item.recorrencia}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="py-3 px-4 text-gray-900" colSpan={2}>
                  Total Mensal
                </td>
                <td className="py-3 px-4 text-blue-600">
                  R$ {servicos.reduce((sum, s) => sum + s.valor, 0)}
                </td>
                <td className="py-3 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Receita/Despesa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar' : 'Adicionar'} {modalType === 'receita' ? 'Receita' : 'Despesa'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {modalType === 'receita' ? 'Status' : 'Categoria'}
                </label>
                <select
                  value={formData.statusOrCategoria}
                  onChange={(e) => setFormData({ ...formData, statusOrCategoria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {modalType === 'receita' ? (
                    <>
                      <option value="Pendente">Pendente</option>
                      <option value="Recebido">Recebido</option>
                    </>
                  ) : (
                    <>
                      <option value="Operacional">Operacional</option>
                      <option value="Pessoal">Pessoal</option>
                      <option value="Fixo">Fixo</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Outros">Outros</option>
                    </>
                  )}
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

      {/* Modal Planejamento Financeiro */}
      {showPlanejamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <Lightbulb className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Planejamento Financeiro com IA</h3>
              </div>
              <button onClick={() => setShowPlanejamento(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {!planejamentoResult ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Dados Atuais:</strong> Receitas: R$ {totalReceitas.toLocaleString()} | 
                    Despesas: R$ {totalDespesas.toLocaleString()} | 
                    Saldo: R$ {saldo.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metas da Empresa *
                  </label>
                  <textarea
                    value={planejamentoForm.metasEmpresa}
                    onChange={(e) => setPlanejamentoForm({ ...planejamentoForm, metasEmpresa: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ex: Aumentar receita em 20%, reduzir custos operacionais, expandir equipe..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período de Análise *
                  </label>
                  <select
                    value={planejamentoForm.periodoAnalise}
                    onChange={(e) => setPlanejamentoForm({ ...planejamentoForm, periodoAnalise: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Último mês">Último mês</option>
                    <option value="Últimos 3 meses">Últimos 3 meses</option>
                    <option value="Últimos 6 meses">Últimos 6 meses</option>
                    <option value="Último ano">Último ano</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalhes Adicionais (opcional)
                  </label>
                  <textarea
                    value={planejamentoForm.detalhesAdicionais}
                    onChange={(e) => setPlanejamentoForm({ ...planejamentoForm, detalhesAdicionais: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={2}
                    placeholder="Informações extras sobre a empresa, contexto, desafios específicos..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPlanejamento(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGerarPlanejamento}
                    disabled={loadingPlanejamento || !planejamentoForm.metasEmpresa}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingPlanejamento ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Gerar Planejamento
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {planejamentoResult.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-800 mb-3 whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setPlanejamentoResult('')
                      setPlanejamentoForm({
                        metasEmpresa: '',
                        periodoAnalise: 'Últimos 6 meses',
                        detalhesAdicionais: ''
                      })
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Novo Planejamento
                  </button>
                  <button
                    onClick={() => setShowPlanejamento(false)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Financeiro