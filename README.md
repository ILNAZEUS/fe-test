# Crypto Table

An interactive, high‑performance table for monitoring cryptocurrency tokens in real time.  
Built with **React + TypeScript**, leveraging **@tanstack/react-table** and **virtualization** for smooth rendering even with large datasets.

## Features

- **Two tables**: Trending Tokens and New Tokens.
- **Live updates** via WebSocket:
  - Price (`priceUsd`)
  - Market cap (`mcap`)
  - Volume (`volumeUsd`)
  - Transactions (`buys`, `sells`, `txns`)
  - Audit status (`mintable`, `freezable`, `honeypot`, `contractVerified`)
  - Migration progress (`migrationPc`)
- **Infinite scroll** and row virtualization for performance.
- **Filtering** and sorting.
- **Copy exchange address** on click.
- **Price flash animation** when values change.
- **Export current table data to CSV**.
- **Unit tests** for core utilities (`mergeTokens`, `updateTokenRealtime`).

## Tech Stack

- **React 19**
- **TypeScript**
- **@tanstack/react-table** — table rendering
- **@tanstack/react-virtual** — virtualization
- **WebSocket API** — streaming data
- **Jest + ts-jest** — testing
- **CSS Modules** — styling

## Installation & Usage

```bash
# Clone the repository
git clone https://github.com/ilnazeus/crypto-table.git
cd crypto-table

# Install dependencies
yarn install

# Start in development mode
yarn start

# Run tests
yarn test

# Build for production
yarn build
```
