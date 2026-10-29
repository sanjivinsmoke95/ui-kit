import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Brand, LandingPage, ThemeProvider, ThemeSwitcher } from '../src';
import { studyvexPage } from './studyvexLanding';
import './styles.css';

const page = { ...studyvexPage, nav: { ...studyvexPage.nav, actions: <><ThemeSwitcher />{studyvexPage.nav.actions}</> } };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="forest" storageKey="ui-kit.playground.theme">
      <LandingPage brand={<Brand name="studyvex" />} {...page} />
    </ThemeProvider>
  </StrictMode>,
);
