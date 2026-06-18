import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipagem para os estados do formulário
type AuthMode = "login" | "register";
type RegisterRole = "admin" | "employee";

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<RegisterRole>("admin");

  // Estados dos campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState(""); // Para funcionários vincularem à empresa

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const baseUrl = "http://localhost:8000/users";

    const endpoint =
      mode === "login" ? `${baseUrl}/login/` : `${baseUrl}/`;

    const payload =
      mode === "login"
        ? { username: email, password }
        : {
            email,
            password,
            name,
            role,
            ...(role === "admin"
              ? { company_name: companyName }
              : { company_code: companyCode }),
          };

    try {
      // Exemplo de integração nativa com fetch
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Ocorreu um erro ao processar sua solicitação.",
        );
      }

      if (mode === "login") {
        localStorage.setItem("@PMEGestao:token", data.access_token);
        setSuccessMessage("Login realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          window.location.href = '/home';
        }, 1500);
      } else {
        setSuccessMessage("Cadastro realizado com sucesso! Faça seu login.");
        setMode("login");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans antialiased text-slate-900">
      {/* Lado Esquerdo: Branding e Preview Visual (Oculto em telas pequenas) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Detalhe geométrico de fundo para simular gráficos */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo combinando com o Dashboard */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
            <svg
              className="w-6 height-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 4.341"
              />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            PME Gestão
          </span>
        </div>

        {/* Card de Atração Visual imitando o Dashboard real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-2xl text-white z-10 max-w-md shadow-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 bg-blue-500/30 px-3 py-1 rounded-full">
            Controle Inteligente
          </span>
          <h2 className="text-3xl font-bold mt-4 mb-2 leading-tight">
            A saúde financeira da sua empresa em um só lugar.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Monitore receitas, otimize despesas e lidere projetos com a
            plataforma feita sob medida para pequenas e médias empresas.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
            <div>Saldo Médio Crescente</div>
            <div className="text-green-400 font-bold flex items-center gap-1">
              <span>↑ +18%</span>
            </div>
          </div>
        </motion.div>

        <div className="text-xs text-blue-200/60 z-10">
          &copy; 2026 PME Gestão. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito: Formulário de Autenticação */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Cabeçalho mobile/formulário */}
          <div className="text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 4.341"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg">PME Gestão</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {mode === "login"
                ? "Acesse sua conta"
                : "Crie sua conta gratuita"}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {mode === "login"
                ? "Seja bem-vindo de volta! Insira suas credenciais abaixo."
                : "Comece a gerenciar seu negócio de forma eficiente hoje."}
            </p>
          </div>

          {/* Alertas de Feedback da API (Inspirados nas cores do seu dashboard) */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
              >
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="font-medium">{errorMessage}</p>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
              >
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seletor de Tipo de Cadastro (Apenas quando estiver em modo 'register') */}
          <AnimatePresence>
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-100 p-1 rounded-xl flex gap-1 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    role === "admin"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Empresa (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => setRole("employee")}
                  className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    role === "employee"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Funcionário (Usuário)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Nome Completo (Apenas no Cadastro) */}
              {mode === "register" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </motion.div>
              )}

              {/* Nome da Empresa (Apenas no Cadastro de Empresa) */}
              {mode === "register" && role === "admin" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Minha Empresa LTDA"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </motion.div>
              )}

              {/* Código da Empresa (Apenas no Cadastro de Funcionário) */}
              {mode === "register" && role === "employee" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Código de Acesso da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value)}
                    placeholder="Ex: PME-12345"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </motion.div>
              )}

              {/* E-mail (Sempre ativo) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Senha (Sempre ativo) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Senha
                  </label>
                  {mode === "login" && (
                    <a
                      href="#forgot"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Esqueceu a senha?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Botão de Ação Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : mode === "login" ? (
                "Entrar na plataforma"
              ) : (
                "Concluir cadastro"
              )}
            </button>
          </form>

          {/* Alternador de Modo (Login / Cadastro) */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              {mode === "login"
                ? "Ainda não tem uma conta?"
                : "Já possui uma conta?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {mode === "login" ? "Cadastre-se aqui" : "Faça login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
