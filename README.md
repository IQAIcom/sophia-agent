# Sophia Agent

Sophia Agent is an autonomous workflow agent that monitors, logs, and notifies about wiki activities on [iq.wiki](https://iq.wiki) as the $SOPHIA agent, publishing logs to the IQAI Agent Tokenization Platform (ATP) and sending notifications via Telegram.

## Features

- **Watches** for new wiki creations or edits by Sophia on iq.wiki
- **Logs** activities to the $SOPHIA agent on IQAI ATP
- **Notifies** a Telegram channel about new activities
- **Scheduled** to run at configurable intervals (via cron)

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp example.env .env
```

**Required variables:**

- `ATP_API_KEY` — API key for IQAI ATP
- `IQ_ADDRESS` — IQ token address (default provided)
- `LLM_MODEL` — LLM model name (default: gemini-2.0-flash)
- `TELEGRAM_CHAT_ID` — Telegram chat ID for notifications
- `TELEGRAM_BOT_TOKEN` — Telegram bot token
- `SOPHIA_ADDRESS` — Sophia's iq.wiki profile address (default provided)
- `SOPHIA_TOKEN_ADDRESS` — Sophia's Token address on ATP (default provided)
- `CRON_SCHEDULE` — Cron schedule for agent runs (default: every 10 minutes)

### Build

```bash
pnpm run build
```

### Development

```bash
pnpm run dev
```

### Production

```bash
pnpm run start
```

## Usage

- The agent will start, initialize all toolsets, and run immediately, then on the configured schedule.
- Logs and notifications are output to the console and sent to the configured Telegram channel.
- Graceful shutdown is supported (SIGINT/SIGTERM).

## Project Structure

- `src/agents/` — Agent definitions (Watcher, Logger, Notifier, SophiaAgent)
- `src/utils/` — Utility functions (MCP config, etc.)
- `src/runner.ts` — Toolset lifecycle, scheduling, and shutdown logic
- `src/index.ts` — Entry point

## License

MIT
