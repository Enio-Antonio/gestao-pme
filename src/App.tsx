import React, { useState } from 'react'
import {LayoutDashboard, DollarSign, Target, Briefcase, Users, Menu, X} from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import Financeiro from '@/components/Financeiro'
import Estrategia from '@/components/Estrategia'
import Projetos from '@/components/Projetos'
import Negocios from '@/components/Negocios'

type Module = 'dashboard' | 'financeiro' | 'estrategia' | 'projetos' | 'negocios'

function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const modules = [
    { id: 'dashboard' as Module, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'financeiro' as Module, name: 'Financeiro', icon: DollarSign },
    { id: 'estrategia' as Module, name: 'Estratégia', icon: Target },
    { id: 'projetos' as Module, name: 'Projetos', icon: Briefcase },
    { id: 'negocios' as Module, name: 'Negócios', icon: Users },
  ]

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'financeiro':
        return <Financeiro />
      case 'estrategia':
        return <Estrategia />
      case 'projetos':
        return <Projetos />
      case 'negocios':
        return <Negocios />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-blue-600">PME Gestão</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{module.name}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">AD</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">admin@empresa.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
    </div>
  )
}

export default App