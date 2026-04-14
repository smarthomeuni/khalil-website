---
title: "Why I Build My Own AI Assistant"
date: 2026-04-12
tags: ["ai", "n8n", "building"]
draft: false
---

I work in AI strategy at a large bank. I spend my days figuring out how 7,000 people should adopt AI tools. And then I come home and build my own.

This isn't a contradiction. It's the same instinct: I don't trust anything I haven't built (or at least taken apart).

## The setup

The core is [n8n](https://n8n.io/) — an open-source workflow automation tool running on my home server. On top of it, I've built what I call the **Family Bot**: an orchestrator that connects WhatsApp and Telegram to a set of sub-agents, each handling a different domain.

The architecture looks like this:

- **Main Orchestrator** — receives messages, classifies intent, routes to the right sub-agent
- **To-do Agent** — reads and writes to my Notion task database
- **Internet Search Agent** — answers questions using web search
- **Document Reader** — retrieves files, guides, and reference material from a Notion knowledge base
- **Image Generator** — creates images on demand and sends them back to the chat

Each sub-agent is a separate n8n workflow, called by the orchestrator as a tool. They share a common pattern: webhook trigger → process → respond. Error handling flows to a dedicated catcher workflow that logs failures and notifies me.

## Why not just use ChatGPT?

Because ChatGPT doesn't know where my kid's passport is. It doesn't know my Notion task list. It can't send a reminder to the family WhatsApp group. It can't pull up the insurance policy PDF when I need the claim number.

The value of a personal AI assistant isn't intelligence — it's **context**. It knows *my* stuff. And because I built it, I know exactly what it can and can't do.

## What's next

The current system handles text well. The next layer is:

1. **Voice** — speech-to-text input, text-to-speech output. Talk to the bot instead of typing.
2. **Memory** — RAG over personal documents using Qdrant vector database. Three collections: family docs, personal notes, and work references.
3. **Calendar awareness** — proactive suggestions based on what's coming up, not just reactive responses.

The goal isn't to build a product. It's to build something that makes my family's daily life slightly less chaotic. And to understand — by building — what these systems can actually do.

Because that's the thing about AI strategy: you can read all the Gartner reports you want, but you don't *know* until you've debugged a webhook at 11pm because the Telegram API changed its rate limits.
