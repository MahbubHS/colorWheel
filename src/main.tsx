import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ThemeProvider required by shadcn Toaster (sonner.tsx uses useTheme) */}
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
