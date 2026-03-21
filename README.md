# Fewash-app

## Mobile app support

This project now includes mobile-app friendly web configuration:

- a web app manifest for installability
- safe-area and viewport handling for phones
- mobile bottom-tab navigation on both dashboards
- standalone Next.js output to support native wrapping

### Run locally

```bash
npm install
npm run dev
```

### Build for a mobile wrapper

```bash
npm run mobile:build
```

The repository also includes a starter `capacitor.config.json` example you can use after installing Capacitor packages in an unrestricted environment. The mobile assets are text-based so they can be reviewed and pushed without binary-file support.
