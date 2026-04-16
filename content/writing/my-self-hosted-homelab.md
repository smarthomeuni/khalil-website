---
title: "My Self-Hosted Homelab"
date: 2026-04-14
tags: ["homelab", "self-hosting", "docker", "linux"]
draft: false
---

I run a self-hosted homelab that handles everything from media and photos to AI automation and personal cloud storage — all from a home server, exposed securely to the internet via a VPS in Singapore. This page documents the full setup: what runs, how it connects, and why.

---

## Architecture Overview

The setup has two physical layers: a **home server** (`sienabot`, Ubuntu + Docker) that runs all the services, and a **VPS** (`SG-Ubuntu-pangolin`) that acts as the secure public entry point. Traffic flows through **Gerbil** (WireGuard tunnel) and **Pangolin** (reverse proxy) on the VPS, down to **Newt** on the home server — meaning no inbound ports are ever opened on the home network.

**Authentik** provides SSO across most services. **Gluetun** routes selected containers through a VPN. **Traefik** handles routing on the VPS side.

## Architecture Diagram

![Homelab network architecture — sienabot + Singapore VPS](/images/Homelab_diagram.png)

---

## The Two Machines

### 🖥️ Home Server — `sienabot`

The main workhorse. Runs Ubuntu with Docker Compose managing ~35 containers across media, AI, photos, cloud storage, and dev tooling. OS on a fast NVMe SSD; all data on a 5.5TB HDD.

| | |
|---|---|
| **CPU** | Intel Core i5-8259U @ 2.30GHz (4 cores / 8 threads) |
| **RAM** | 16GB |
| **OS drive** | 232GB NVMe SSD |
| **Storage** | 5.5TB HDD (`/mnt/6tbw`) |
| **OS** | Ubuntu 24.04.4 LTS |

### ☁️ VPS — `SG-Ubuntu-pangolin` (Singapore)

A lightweight DigitalOcean droplet acting purely as the public-facing gateway. It runs the Pangolin/Gerbil tunnel stack and Traefik, so the home server's IP is never exposed. Also hosts 3x-ui for an XRay proxy and Guacamole for browser-based remote desktop access.

| | |
|---|---|
| **CPU** | 1× vCPU @ 2.0GHz (DigitalOcean Regular) |
| **RAM** | 2GB |
| **Disk** | 25GB SSD |
| **OS** | Ubuntu 24.10 |

---

## Networking & Access

The entire access model is built around keeping the home server private:

- **Gerbil** (on VPS) opens a WireGuard tunnel endpoint
- **Newt** (on home server) connects outbound to Gerbil — no inbound ports on the home router
- **Pangolin** manages tunnel routing and proxies requests through to home services
- **Traefik** handles HTTPS routing and certificates on the VPS
- **Authentik** sits in front of all externally-accessible services as a forward-auth SSO layer
- **Gluetun** routes specific containers (n8n, SearXNG) through a commercial VPN
- **3x-ui** provides an XRay/VLESS proxy on the VPS for additional private tunnelling
- **Guacamole** enables full browser-based RDP/VNC remote desktop into the home server

---

## Services

### 📺 Media

- **Plex** — Central media server for films, TV, and music. Streams to any device, locally or remotely.
- **Seerr** — Media request management. Family members can request content through a clean UI.
- **MeTube** — Web front-end for yt-dlp. One-click downloads from YouTube and other platforms straight to the media drive.
- **Audiobookshelf** — Self-hosted audiobook and podcast server with full mobile app support.
- **Calibre Web Automated** — Ebook library with automatic metadata, cover fetching, and Kindle delivery.

### 📸 Photos

- **Immich** — Self-hosted Google Photos replacement. Handles automatic phone backup, facial recognition, smart albums, and sharing. Runs a dedicated machine-learning container for on-device search and face grouping.

### 🤖 AI & Automation

- **Open WebUI** — Local AI chat interface supporting multiple LLM backends. Apache Tika handles document parsing for RAG workflows.
- **OpenClaw** — Custom AI gateway and orchestration layer (personal project).
- **n8n** — Workflow automation engine. Powers the Family Bot (WhatsApp/Telegram), scheduled jobs, and various integrations. Routed through Gluetun VPN.
- **Qdrant** — Vector database, used as the memory and retrieval layer for AI agents.
- **SearXNG** — Self-hosted meta search engine. Two instances: one for personal browsing, one as a tool for AI agents.
- **Evolution API** — WhatsApp API bridge used by n8n for messaging automation.

### 📚 Knowledge & Cloud

- **Karakeep** — Self-hosted bookmark and read-later manager. Full-text search via Meilisearch, web archiving via headless Chrome.
- **Nextcloud** — Personal cloud: file storage, calendar, and contacts sync across all devices.

### 🛠️ Dev & Monitoring

- **Hugo** — Static site server for local development of this website.
- **code-server** — VS Code in the browser. Full development environment accessible from any device.
- **Termix** — Web-based terminal. Quick server access without a local SSH client. Runs on both home server and VPS.
- **Beszel** — Lightweight monitoring dashboard. Tracks CPU, memory, disk, and network. Agent runs on both machines.
- **Glance** — Personal start-page aggregating RSS feeds, service status, and quick links.

---

## Storage & Backup

All data lives on a single **5.5TB HDD** (`/mnt/6tbw`), organised into folders by type: media, photos, audiobooks, ebooks, and backups. The OS runs separately on a 232GB NVMe SSD, keeping it fast and isolated from data.

Offsite backup runs via `rclone` to **Backblaze B2** on a cron schedule, with Telegram notifications on completion or failure.

---

## Security Model

> The home server IP is never public. All external access tunnels through the VPS.

- All traffic enters via Traefik on the VPS → Pangolin → Gerbil/WireGuard → Newt on home server
- Authentik SSO in front of all externally-accessible services
- SSH hardened: key-only auth, root login disabled
- Gluetun isolates sensitive containers behind a VPN
- 3x-ui provides an additional XRay proxy layer for private tunnelling
