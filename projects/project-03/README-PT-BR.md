# Projeto 03: Continuidade entre Múltiplas Sessões com Controle de Escopo

Avalie se logs de progresso, handoff de sessão, controle explícito de escopo e
gates de verificação melhoram a precisão da entrega durante reinicializações.

## Guia de Diretórios

| Diretório | Significado |
|------|------|
| `starter/` | **Ponto de partida**: baseado na solução do P2, com divisão de documentos em partes, extração de metadados, status de indexação e QA baseado em contexto ainda pendentes de implementação. Ele possui um `feature_list.json` inicial, mas não possui o harness completo de retomada (`init.sh`, `session-handoff.md`, `claude-progress.md`, checklist de estado limpo). |
| `solution/` | **Implementação de referência**: todos os recursos estão implementados. O `AGENTS.md` inclui a estratégia de "uma funcionalidade por vez", e o repositório adiciona artefatos de reinicialização/continuidade (`init.sh`, `session-handoff.md`, `claude-progress.md`, `clean-state-checklist.md`). |

## Como Usar

```sh
cd starter
npm install
# Execute pelo menos duas sessões de agente. Interrompa uma vez no meio da tarefa e depois retome a partir do estado do repositório.
# Observe se o agente mantém o escopo e atualiza o feature_list.json.

cd ../solution
npm install
# Inspecione os artefatos de continuidade concluídos e as evidências das funcionalidades.
```

## Contrato Exato da Tarefa

O starter do Projeto 03 não é uma aplicação vazia. Ele é o Projeto 02 mais o trabalho
de indexação e QA baseado em contexto ainda não concluído. Complete estes itens um por vez:

| Funcionalidade / artefato | Estado no Starter | Evidência da Solution |
|------|------|------|
| Divisão de documentos em partes | `IndexingService` precisa criar chunks considerando parágrafos | `src/services/indexing-service.ts`, item `document-chunking` do `feature_list.json` |
| Extração de metadados | Os metadados dos documentos estão incompletos para o trabalho de indexação | `src/services/document-service.ts`, `DocumentDetail.tsx`, item `metadata-extraction` |
| Interface de status de indexação | Barra de status precisa exibir quantidade indexada / total de chunks / status por cores | `src/renderer/components/StatusBar.tsx`, `App.tsx`, item `indexing-status-ui` |
| QA baseado em contexto | O QA deve citar chunks recuperados com trechos e nível de confiança | `src/services/qa-service.ts`, `QuestionPanel.tsx`, item `grounded-qa` |
| Harness de continuidade | O Starter não possui os artefatos finais de retomada/handoff | `init.sh`, `session-handoff.md`, `claude-progress.md`, `clean-state-checklist.md` |

Não trate isso como "adicionar qualquer funcionalidade de múltiplas sessões". O recorte
de produto esperado é indexação mais QA baseado em citações, e o recorte de harness
esperado é o rastreamento de progresso que permite retomada.

## Funcionalidades Cobertas

- Divisão de documentos em partes (baseada em parágrafos, cerca de 500 caracteres)
- Extração de metadados (contagem de palavras, contagem de linhas, contagem de parágrafos)
- Status da indexação exibido na interface
- Fluxo básico de QA com citações de fontes

## Aulas Relacionadas

- [Aula 05: Por Que Tarefas de Longa Duração Perdem Continuidade](../../docs/pt-BR/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
- [Aula 06: Por Que a Inicialização Precisa Ter Sua Própria Fase](../../docs/pt-BR/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)