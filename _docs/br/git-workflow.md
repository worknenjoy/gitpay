---
layout: doc
lang: br
role: contributor
title: Fluxo de trabalho com Git
subtitle: Como organizar sua branch e seu pull request para a solução passar nas verificações do Gitpay
tags: contributor, git, github, pull-requests
---

#### Índice
{:.no_toc}
* TOC
{:toc}

O Gitpay não muda o seu jeito de trabalhar com Git. Ele só lê o seu pull request no GitHub para decidir se a recompensa pode ser paga. Esta página mostra o fluxo que passa nessas verificações de primeira.

## 1. Fork e branch

Se você não tem permissão de escrita no repositório, faça um fork e clone o seu fork:

```bash
git clone https://github.com/<seu-usuario>/<repo>.git
cd <repo>
git remote add upstream https://github.com/<dono>/<repo>.git
git fetch upstream
git checkout -b fix-123-descricao-curta upstream/main
```

Use a branch padrão do projeto (`main`, `master` ou a que o projeto usar) e siga o guia de contribuição dele.

## 2. Commit e push

```bash
git add .
git commit -m "Corrige loop de redirecionamento no login (#123)"
git push origin fix-123-descricao-curta
```

## 3. Abra o pull request no repositório original

Abra o pull request da branch do seu fork **para o repositório original**, aquele a que a issue pertence. Um pull request mesclado no seu próprio fork não conta.

Na descrição, cite a issue com uma palavra-chave de fechamento:

```
Fixes #123
```

Também valem `Closes #123`, `Resolves #123` ou a URL completa da issue. A palavra-chave faz duas coisas que o Gitpay verifica: cita a issue e faz o GitHub fechá-la automaticamente quando o pull request é mesclado.

## 4. Depois do merge

Confirme que a issue está fechada e envie a URL do pull request no Gitpay. Veja [Envie uma solução](/docs/br/pull-requests/).

## Checklist

- [ ] Entrei no Gitpay com a mesma conta do GitHub que abriu o pull request
- [ ] Pull request aberto no repositório original
- [ ] Descrição cita a issue (`Fixes #123` ou a URL da issue)
- [ ] Pull request mesclado
- [ ] Issue fechada
- [ ] Solução enviada no Gitpay

## Próximos passos

- [Envie uma solução](/docs/br/pull-requests/)
