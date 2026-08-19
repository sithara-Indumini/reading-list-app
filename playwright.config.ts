import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { open: 'never' }]],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
})
