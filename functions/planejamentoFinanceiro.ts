import { createClient } from "@lumi.new/sdk"

interface PlanejamentoRequest {
  receitasTotal: number
  despesasTotal: number
  saldo: number
  metasEmpresa: string
  periodoAnalise: string
  detalhesAdicionais?: string
}

Deno.serve(async (req) => {
  console.log(JSON.stringify({ stage: "start", url: req.url, method: req.method }))

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const projectId = Deno.env.get("PROJECT_ID")
    const apiBaseUrl = Deno.env.get("API_BASE_URL")
    const authOrigin = Deno.env.get("AUTH_ORIGIN")
    const lumiApiKey = Deno.env.get("LUMI_API_KEY")

    console.log(JSON.stringify({
      stage: "config",
      keys: {
        PROJECT_ID: Boolean(projectId),
        LUMI_API_KEY: Boolean(lumiApiKey),
        API_BASE_URL: Boolean(apiBaseUrl),
        AUTH_ORIGIN: Boolean(authOrigin),
      }
    }))

    if (!lumiApiKey) {
      console.error(JSON.stringify({ stage: "error", message: "LUMI_API_KEY não configurada" }))
      return new Response(JSON.stringify({ error: "Configuração incompleta" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const lumi = createClient({
      projectId,
      apiBaseUrl,
      authOrigin,
    })

    const body: PlanejamentoRequest = await req.json()
    console.log(JSON.stringify({ stage: "request_body", payload: body }))

    const { receitasTotal, despesasTotal, saldo, metasEmpresa, periodoAnalise, detalhesAdicionais } = body

    // Construir prompt para a IA
    const prompt = `Você é um consultor financeiro especializado em pequenas empresas.

Análise Financeira Atual:
- Receitas Totais: R$ ${receitasTotal.toLocaleString('pt-BR')}
- Despesas Totais: R$ ${despesasTotal.toLocaleString('pt-BR')}
- Saldo Atual: R$ ${saldo.toLocaleString('pt-BR')}
- Período de Análise: ${periodoAnalise}

Metas da Empresa:
${metasEmpresa}

${detalhesAdicionais ? `Informações Adicionais:\n${detalhesAdicionais}` : ''}

Por favor, forneça um planejamento financeiro detalhado com:

1. **Análise da Situação Atual**: Avalie a saúde financeira com base nos números apresentados.

2. **Recomendações Estratégicas**: Sugira 3-5 ações prioritárias para melhorar a gestão financeira.

3. **Projeções**: Faça projeções realistas para os próximos 3-6 meses considerando as metas.

4. **Alertas e Riscos**: Identifique possíveis riscos financeiros e como mitigá-los.

5. **Oportunidades de Crescimento**: Sugira áreas onde a empresa pode investir ou economizar.

Mantenha a resposta estruturada, prática e focada em ações concretas que uma pequena empresa pode implementar.`

    console.log(JSON.stringify({ stage: "ai_request", model: "gemini-2.5-flash" }))

    const result = await lumi.tools.ai.generateText({
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'Você é um consultor financeiro experiente, especializado em ajudar pequenas empresas a otimizar suas finanças e alcançar suas metas.' },
        { role: 'user', content: prompt }
      ]
    })

    console.log(JSON.stringify({
      stage: "ai_response",
      chatId: result.chatId,
      contentLength: result.content.length
    }))

    return new Response(JSON.stringify({
      planejamento: result.content,
      chatId: result.chatId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (error: any) {
    console.error(JSON.stringify({
      stage: "error",
      type: error.constructor.name,
      message: error.message,
      stack: error.stack
    }))

    return new Response(JSON.stringify({ error: error.message || "Erro ao gerar planejamento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})