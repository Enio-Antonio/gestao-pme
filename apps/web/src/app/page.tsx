"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

function LeftSide() {
  return (
    <div className="from-primary to-secundary text-background relative hidden flex-col justify-between overflow-hidden bg-linear-to-br p-12 lg:flex lg:w-1/2">
      {/* Imagem geométrica de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src="/geometric.svg"
          alt="Detalhe geométrico"
          width={500}
          height={500}
          className="h-full w-full"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="z-10 flex items-center gap-3"
      >
        <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
          <svg
            className="text-background h-6 w-6"
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
        <span className="text-xl font-bold tracking-tight">Gestão PME</span>
      </motion.div>

      {/* Card de atração visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="z-10 max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-lg"
      >
        <span className="rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold tracking-wider text-blue-200 uppercase">
          Controle Inteligente
        </span>
        <h2 className="mt-4 mb-2 text-3xl leading-tight font-bold">
          A saúde financeira da sua empresa em um só lugar.
        </h2>
        <p className="text-sm leading-relaxed text-blue-100">
          Monitore receitas, otimize despesas e lidere projetos com a plataforma feita sob medida
          para pequenas e médias empresas.
        </p>
      </motion.div>

      {/* Direitos autorais */}
      <div className="z-10 text-xs text-blue-200/60">
        &copy; 2026 Gestão PME. Todos os direitos reservados.
      </div>
    </div>
  );
}

interface FormState {
  mode: "login" | "register";
  role: "admin" | "employee";
  errorMessage?: string;
  successMessage?: string;
  isLoading?: boolean;
}

interface Admin {
  companyCode?: string;
  corporateName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  taxRegime: "MEI" | "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
  industry:
    | "Comércio"
    | "Restaurante"
    | "Oficina"
    | "Clínica"
    | "Agência"
    | "Tecnologia"
    | "Educação"
    | "Construção"
    | "Outro";
}

interface Employee {
  companyCode: string;
  fullName: string;
  cpf: string;
  position: string;
  email: string;
  password: string;
}

const registerForm = {
  admin: [
    {
      key: "corporateName",
      label: "Razão Social",
      placeholder: "Ex: Empresa LTDA",
      type: "text",
    },
    {
      key: "tradeName",
      label: "Nome de Fachada",
      placeholder: "Ex: Mercado Central",
      type: "text",
    },
    {
      key: "cnpj",
      label: "CNPJ",
      placeholder: "00.000.000/0000-00",
      type: "text",
    },
    {
      key: "email",
      label: "E-mail",
      placeholder: "contato@empresa.com",
      type: "email",
    },
    {
      key: "taxRegime",
      label: "Regime Tributário",
      placeholder: "Selecione um regime",
      type: "select",
      options: ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"],
    },
    {
      key: "industry",
      label: "Segmento",
      placeholder: "Selecione um segmento",
      type: "select",
      options: [
        "Comércio",
        "Restaurante",
        "Oficina",
        "Clínica",
        "Agência",
        "Tecnologia",
        "Educação",
        "Construção",
        "Outro",
      ],
    },
  ],
  employee: [
    {
      key: "companyCode",
      label: "Código da Empresa",
      placeholder: "Ex: PME-12345",
      type: "text",
    },
    {
      key: "fullName",
      label: "Nome Completo",
      placeholder: "Ex: Francisco José",
      type: "text",
    },
    {
      key: "cpf",
      label: "CPF",
      placeholder: "000.000.000-00",
      type: "text",
    },
    {
      key: "position",
      label: "Cargo",
      placeholder: "Ex: Gerente de Vendas",
      type: "text",
    },
    {
      key: "email",
      label: "E-mail",
      placeholder: "contato@pessoal.com",
      type: "email",
    },
    {
      key: "password",
      label: "Senha",
      placeholder: "••••••••",
      type: "password",
    },
  ],
};

function Form({ mode, role, isLoading }: FormState) {
  return (
    <form className="space-y-5">
      <div className="space-y-4">
        {/* Login */}
        {mode === "login" && (
          <>
            {/* Código da Empresa */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label
                htmlFor="companyCode"
                className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
              >
                Código da Empresa
              </label>
              <input
                type="text"
                required
                // value={companyCode}
                // onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="Ex: PME-12345"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </motion.div>

            {/* CPF */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label
                htmlFor="cpf"
                className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
              >
                CPF
              </label>
              <input
                type="text"
                required
                // value={cpf}
                // onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </motion.div>

            {/* Senha */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                >
                  Senha
                </label>
              </div>
              <input
                type="password"
                required
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </motion.div>
          </>
        )}

        {/* Cadastro */}
        {mode === "register" &&
          registerForm[role].map((field) => (
            <motion.div key={field.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label
                htmlFor={field.key}
                className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  required
                  // value={formData[field.key] || ""}
                  // onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {/* @ts-expect-error */}
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  required
                  // value={formData[field.key] || ""}
                  // onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              )}
            </motion.div>
          ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 transition-all hover:cursor-pointer hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
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
          "Entrar"
        ) : (
          "Cadastrar"
        )}
      </button>
    </form>
  );
}

function RightSide() {
  const [form, setForm] = useState<FormState>({
    mode: "login",
    role: "employee",
  });

  return (
    <div className="flex w-full items-center justify-center bg-white p-6 sm:p-12 lg:w-1/2">
      <div className="w-full max-w-md space-y-8">
        {/* Cabeçalho */}
        <div className="text-center lg:text-left">
          {/* Logo mobile */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <svg
                className="h-5 w-5"
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
            <span className="text-lg font-bold">Gestão PME</span>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {form.mode === "login" ? "Acesse sua conta" : "Crie sua conta gratuita"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {form.mode === "login"
              ? "Seja bem-vindo de volta! Insira suas credenciais abaixo."
              : "Comece a gerenciar seu negócio de forma eficiente hoje."}
          </p>
        </div>

        {/* Alertas da API */}
        <AnimatePresence mode="wait">
          {form.errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" />
              <p className="font-medium">{form.errorMessage}</p>
            </motion.div>
          )}
          {form.successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700"
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-blue-500" />
              <p className="font-medium">{form.successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seletor de tipo de cadastro */}
        <AnimatePresence mode="popLayout">
          {form.mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-1 overflow-hidden rounded-xl bg-slate-100 p-1"
            >
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "admin" })}
                className={`w-1/2 rounded-lg py-2 text-xs font-semibold transition-all duration-200 hover:cursor-pointer ${
                  form.role === "admin"
                    ? "text-button bg-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "employee" })}
                className={`w-1/2 rounded-lg py-2 text-xs font-semibold transition-all duration-200 hover:cursor-pointer ${
                  form.role === "employee"
                    ? "text-button bg-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Funcionário
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário */}
        <Form {...form} />

        {/* Alternador de modo */}
        <div className="pt-2 text-center">
          <p className="text-sm text-slate-500">
            {form.mode === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}{" "}
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, mode: form.mode === "login" ? "register" : "login" })
              }
              className="text-button hover:text-button-hover font-bold transition-colors hover:cursor-pointer"
            >
              {form.mode === "login" ? "Cadastre-se aqui" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen font-sans">
      <LeftSide />
      <RightSide />
    </div>
  );
}
