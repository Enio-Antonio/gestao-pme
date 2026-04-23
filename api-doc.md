## API Information - Planejamento Financeiro com IA
* Function URL:
https://api.lumi.new/v1/functions/p421779348262989824/planejamentoFinanceiro

* __POST JSON__ payloads to this endpoint.

* __Headers__:
```json
{
  "Content-Type": "application/json"
}
```
* __Request Body__:
```json
{
  "receitasTotal": 55000,
  "despesasTotal": 30000,
  "saldo": 25000,
  "metasEmpresa": "Aumentar receita em 20%, reduzir custos operacionais",
  "periodoAnalise": "Últimos 6 meses",
  "detalhesAdicionais": "Empresa em crescimento, 5 funcionários"
}
```
* __Campos:__
    1. __receitasTotal (number, obrigatório)__: Total de receitas
    1. __despesasTotal (number, obrigatório)__: Total de despesas
    1. __saldo (number, obrigatório)__: Saldo atual
    1. __metasEmpresa (string, obrigatório)__: Metas e objetivos da empresa
    1. __periodoAnalise (string, obrigatório)__: Período de análise (ex: "Últimos 6 meses")
    1. __detalhesAdicionais (string, opcional)__: Informações adicionais sobre a empresa

* __Response__
```json
{
  "planejamento": "# Análise da Situação Atual...",
  "chatId": "chat_123456"
}
```
* __Usage Example (cURL)__:
```bash
curl -X POST "https://api.lumi.new/v1/functions/p421779348262989824/planejamentoFinanceiro" \
  -H "Content-Type: application/json" \
  -d '{
    "receitasTotal": 55000,
    "despesasTotal": 30000,
    "saldo": 25000,
    "metasEmpresa": "Aumentar receita em 20%",
    "periodoAnalise": "Últimos 6 meses"
  }'
```