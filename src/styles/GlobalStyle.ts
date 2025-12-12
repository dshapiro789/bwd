import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.main};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
    font-weight: 400; /* Lighter weight for elegance */
    letter-spacing: -0.02em;
  }

  p {
    color: ${theme.colors.textSecondary};
    margin-bottom: ${theme.spacing.md};
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: ${theme.transitions.default};
  }

  button {
    border: none;
    outline: none;
    font-family: inherit;
  }
  
  /* Hide cursor on ALL elements for non-touch devices */
  @media (hover: hover) and (pointer: fine) {
    *, *::before, *::after {
      cursor: none !important;
    }
  }

  /* Custom Selection */
  ::selection {
    background-color: ${theme.colors.gold};
    color: ${theme.colors.background};
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.secondary};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gold};
  }
`;
