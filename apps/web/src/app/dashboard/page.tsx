"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  DollarSign,
  Target,
  Briefcase,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Financeiro from "@/components/Financeiro";
import Estrategia from "@/components/Estrategia";
import Projetos from "@/components/Projetos";
import Negocios from "@/components/Negocios";
import { DataProvider } from "@/contexts/DataContext";
// import Login from "@/components/Login";

type Module = "dashboard" | "financeiro" | "estrategia" | "projetos" | "negocios";

export default function Home() {
  const [activeModule, setActiveModule] = useState<Module>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 1. Substituímos a simulação pela verificação real do Token do Django
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Verifica se o token existe assim que o App carrega
  useEffect(() => {
    const token = localStorage.getItem("@PMEGestao:token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const modules = [
    { id: "dashboard" as Module, name: "Dashboard", icon: LayoutDashboard },
    { id: "financeiro" as Module, name: "Financeiro", icon: DollarSign },
    { id: "estrategia" as Module, name: "Estratégia", icon: Target },
    { id: "projetos" as Module, name: "Projetos", icon: Briefcase },
    { id: "negocios" as Module, name: "Negócios", icon: Users },
  ];

  // 2. Função real de Logout
  const handleLogout = () => {
    localStorage.removeItem("@PMEGestao:token");
    setIsAuthenticated(false);
  };

  // if (!isAuthenticated) {
  //   // Se não estiver logado, mostra o Login.
  //   // Quando o Login der certo e der um "window.location.href = '/'", a página recarrega e entra no Dashboard!
  //   return <Login />;
  // }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "financeiro":
        return <Financeiro />;
      case "estrategia":
        return <Estrategia />;
      case "projetos":
        return <Projetos />;
      case "negocios":
        return <Negocios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col border-r border-gray-200 bg-white transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          {sidebarOpen && <h1 className="text-xl font-bold text-blue-600">PME Gestão</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{module.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="font-semibold text-blue-600">AD</span>
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-900">Admin</p>
                  <p className="truncate text-xs text-gray-500">admin@empresa.com</p>
                </div>
              )}
            </div>

            {/* Botão de Sair */}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 transition-colors hover:text-red-500"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}

      <DataProvider>
        <main className="flex-1 overflow-auto">{renderModule()}</main>
      </DataProvider>
    </div>
  );
}
