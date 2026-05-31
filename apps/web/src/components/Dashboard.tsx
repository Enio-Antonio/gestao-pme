import React, { useMemo } from 'react'
import {TrendingUp, TrendingDown, AlertCircle, Briefcase, Users, DollarSign} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/contexts/DataContext'

const Dashboard = () => {
  const { receitas, despesas, projetos, leads } = useData()

  // Calculate totals
  const totalReceitas = useMemo(() => 
    receitas.reduce((sum, r) => sum + r.valor, 0), 
    [receitas]
  )
  const totalDespesas = useMemo(() => 
    despesas.reduce((sum, d) => sum + d.valor, 0), 
    [despesas]
  )
  const saldo = totalReceitas - totalDespesas

  const projetosAtivos = projetos.filter(p => p.status === 'Em andamento' || p.status === 'Atrasado').length
  const leadsAtivos = leads.filter(l => l.etapa !== 'Fechado' && l.etapa !== 'Perdido').length

  const chartData = [
    { month: 'Jan', value: 45000 },
    { month: 'Fev', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Abr', value: 61000 },
    { month: 'Mai', value: 55000 },
    { month: 'Jun', value: totalReceitas },
  ]

  const stats = [
    {
      title: 'Receitas',
      value: `R$ ${totalReceitas.toLocaleString()}`,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Despesas',
      value: `R$ ${totalDespesas.toLocaleString()}`,
      change: '-5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'red',
    },
    {
      title: 'Saldo',
      value: `R$ ${saldo.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Projetos Ativos',
      value: projetosAtivos.toString(),
      change: '+2',
      trend: 'up',
      icon: Briefcase,
      color: 'purple',
    },
    {
      title: 'Leads Ativos',
      value: leadsAtivos.toString(),
      change: '+6',
      trend: 'up',
      icon: Users,
      color: 'orange',
    },
  ]

  const alerts = useMemo(() => {
    const projectAlerts = projetos
      .filter(p => p.diasRestantes > 0 && p.diasRestantes <= 5)
      .map(p => ({
        id: `proj-${p.id}`,
        type: 'warning',
        message: `Projeto "${p.nome}" com prazo próximo (${p.diasRestantes} dias)`
      }))

    const overdueAlerts = projetos
      .filter(p => p.diasRestantes < 0)
      .map(p => ({
        id: `over-${p.id}`,
        type: 'danger',
        message: `Projeto "${p.nome}" atrasado em ${Math.abs(p.diasRestantes)} dias`
      }))

    const leadAlert = leadsAtivos > 0 ? [{
      id: 'leads',
      type: 'info',
      message: `${leadsAtivos} leads ativos no pipeline`
    }] : []

    return [...overdueAlerts, ...projectAlerts, ...leadAlert]
  }, [projetos, leadsAtivos])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Crescimento Financeiro</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Alertas</h2>
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'danger'
                      ? 'bg-red-50 border-red-200'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex gap-3">
                    <AlertCircle
                      size={20}
                      className={
                        alert.type === 'danger'
                          ? 'text-red-600'
                          : alert.type === 'warning'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }
                    />
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhum alerta no momento</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard