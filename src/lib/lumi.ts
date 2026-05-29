// Lumi SDK client - kept minimal since the project uses direct fetch for AI features
export const lumi = {
  functions: {
    invoke: async (name: string, options: { method: string; body: Record<string, unknown> }) => {
      const response = await fetch(
        `https://api.lumi.new/v1/functions/p421779348262989824/${name}`,
        {
          method: options.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options.body),
        }
      )
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw { data }
      }
      return response.json()
    },
  },
}
