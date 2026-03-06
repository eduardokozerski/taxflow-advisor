Projeto: TaxFlow Advisor

Plataforma web de diagnóstico empresarial e eficiência fiscal para geração de leads qualificados para empresas de contabilidade. Será postado no meu GitHub ([text](https://github.com/eduardokozerski/taxflow-advisor))

O sistema analisa dados básicos da empresa e gera:
simulação tributária
análise financeira
score de eficiência fiscal
ranking comparativo de mercado
relatório automatizado

Objetivo principal: identificar oportunidades de planejamento tributário e redução de custos.

Problema que resolve

Empresas muitas vezes:
não sabem se pagam impostos demais
não entendem sua eficiência financeira
não sabem qual serviço contábil precisam
O sistema cria um diagnóstico automático em menos de 30 segundos.

Resultado: leads extremamente qualificados para a contabilidade.

Funcionalidades do sistema
1️⃣ Qualificador de empresa

Formulário inicial para entender o perfil do negócio.

Dados coletados:
atividade da empresa
faturamento mensal
número de funcionários
folha salarial
impostos pagos
custos operacionais

Fluxo:

Usuário responde perguntas
↓
Backend classifica empresa
↓
Sistema define possíveis serviços contábeis

Exemplo de resultado:

Perfil empresarial identificado:

Empresa de serviços
Faturamento: 40k
Funcionários: 3

Serviços recomendados:

• Planejamento Tributário
• Redução de Custos
2️⃣ Simulador tributário

Simulação de regime tributário com base em estimativas.

Regimes simulados:
Simples Nacional
Lucro Presumido
Lucro Real
Exemplo de resultado:
Simulação tributária:
Simples Nacional → 8% a 12%
Lucro Presumido → 13% a 16%
Lucro Real → variável

⚠️ sempre com aviso:

Simulação estimada para fins informativos.
3️⃣ Analisador financeiro

Calcula indicadores empresariais importantes.

Indicadores gerados:

carga tributária

custo com funcionários

margem operacional

Exemplo:

Carga tributária: 18%
Custo com funcionários: 42%
Margem operacional: 22%
4️⃣ Score de eficiência fiscal

Sistema cria um Tax Efficiency Score (0–100).

Classificação:

0–40 → baixa eficiência
40–70 → eficiência média
70–100 → alta eficiência

Exemplo:

Tax Efficiency Score

████████░░ 72%

Classificação:
Eficiência fiscal média
5️⃣ Ranking visual comparativo (feature que impressiona)

O sistema compara os indicadores da empresa com médias de mercado.

Exemplo:

Comparação com empresas de serviços
Indicador Sua empresa Média do setor
Carga tributária 18% 13%
Custo funcionários 45% 32%
Margem operacional 22% 28%

Visualmente:

Carga tributária

Você ████████████████ 18%
Mercado ███████████ 13%
Tecnologia usada para o ranking

Para gráficos e visualizações:

biblioteca recomendada:
Recharts
Motivos:
leve
integra perfeitamente com React
muito usada em dashboards
fácil de estilizar com Tailwind

Exemplo de gráfico:
barras comparativas
gráfico radar de eficiência
indicadores percentuais

Alternativa muito boa também:
Chart.js

Mas Recharts combina melhor com React.
6️⃣ Relatório automático

Após análise, o sistema gera um relatório.

Conteúdo:

Diagnóstico Empresarial

Empresa analisada
Indicadores financeiros
Simulação tributária
Score de eficiência
Comparação com mercado
Recomendações contábeis

Exportação:
PDF automático.
Tecnologia:
Puppeteer

7️⃣ Geração de lead

Ao final da análise:
Quer falar com um especialista?
[ Agendar consultoria ]

Opções possíveis:
WhatsApp
formulário
email
CRM da contabilidade

Arquitetura técnica
Frontend:
Next.js
Tailwind CSS
SWR
Recharts
Shadcn (com toast)

Backend:
Node.js
Express
Prisma

Banco de dados:
SQLite (local)

Fluxo completo do sistema
Usuário entra no site
↓
Responde questionário
↓
Backend analisa dados
↓
Simulador tributário roda
↓
Analisador financeiro roda
↓
Score de eficiência fiscal gerado
↓
Ranking comparativo exibido
↓
Relatório gerado
↓
Lead enviado para contabilidade

Plano de desenvolvimento: cada parte desse plano será uma request para IA, tudo separado, não faça todas as etapas de uma vez só. E depois espere o OK do usuário humano antes de ir para a próxima etapa. Toda recomendação de arquitetura aqui é uma sugestão, se for preciso fazer uma outra organização para que o código funcione, faça.

1️⃣ Etapa 1: arquitetura (NÃO código)
Act as a senior software architect.
Create the full architecture for a SaaS called TaxFlow Advisor.
Stack:

- Next.js
- Node.js
- Express
- Prisma
- SQLite
- Recharts
- Tailwind
- Shadcn

Features:

- business qualification
- tax simulator
- financial analyzer
- efficiency score
- ranking dashboard
- PDF report

Generate:

- folder structure
- modules
- API endpoints
- database schema

Resultado esperado:
estrutura de pastas
endpoints
modelos do banco
divisão frontend/backend (as pastas frontend e backend já existem então ignore isso)

2️⃣ Etapa 2: banco de dados
Generate the Prisma schema for this system.
Provavelmente algo assim (mude se for preciso):
Company
Analysis
FinancialMetrics
TaxSimulation
ScoreResult

3️⃣ Etapa 3: backend
primeiro
Generate the Express backend structure.
Include controllers, services and routes.
depois
Implement the tax simulator service.
depois
Implement the business efficiency score calculator.

4️⃣ Etapa 4: frontend
Generate the Next.js frontend.
Pages:

- qualification form
- financial input
- results dashboard

Depois os gráficos:
Create a dashboard using Recharts that compares:

- tax rate vs market
- payroll vs market
- margin vs market

ATENÇÃO: Use a pasta "copiar ui" presente no projeto para basear no layout (UI) liquid glass.
