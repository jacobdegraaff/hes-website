/**
 * Lemnion — Brand configuration (machine-readable single source of truth).
 *
 * Mirrors /assets/brand/tokens.css so JS/TS consumers and future AI agents
 * read the same values instead of inventing new ones.
 *
 *   import { brand } from './assets/brand/brand.config.js'
 *
 * RULE: never redefine a brand value inline. Import from here or reference the
 * CSS tokens. See /docs/AI_BRAND_RULES.md.
 */
export const brand = {
  name: 'Lemnion',
  descriptor: 'Hospitality Energy Solutions',
  tagline: 'Optimizing Every Watt',
  partner: 'Stroomlijnen',

  colors: {
    primary: '#0F3D23',
    secondary: '#2E7032',
    accent: '#7FBF3A',
    accentHover: '#6FAA2E',
    light: '#B7E08A',
    deep0: '#0A2E1A',
    deep1: '#163D26',
    neutral: {
      white: '#FFFFFF',
      offWhite: '#F5F7F2',
      n50: '#F5F7F2',
      n100: '#F0F5EA',
      n200: '#EFF3EC',
      n300: '#D4DDD0',
      n400: '#A0AEA0',
      n500: '#556B58',
      n700: '#3D4F40',
      n900: '#2F3437',
    },
    semantic: {
      textPrimary: '#2F3437',
      textSecondary: '#556B58',
      background: '#F5F7F2',
      surface: '#FFFFFF',
      border: '#D4DDD0',
      success: '#27AE60',
      warning: '#E67E22',
      error: '#C0392B',
      errorSoftBg: '#FFF3F0',
      errorSoftBorder: '#E8A090',
      info: '#33658A', // PROPOSED — not yet in use
    },
  },

  typography: {
    fontDisplay: "'Montserrat', system-ui, -apple-system, sans-serif",
    fontBody: "'Inter', system-ui, -apple-system, sans-serif",
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    scale: {
      hero: 'clamp(2rem, 5vw, 3.5rem)',
      h2: 'clamp(1.5rem, 3.5vw, 2.5rem)',
      h3: 'clamp(1.1rem, 2vw, 1.5rem)',
      h4: '1.1rem',
      bodyLg: '1.15rem',
      body: '1rem',
      bodySm: '0.95rem',
      small: '0.9rem',
      xs: '0.85rem',
      caption: '0.8rem',
    },
    lineHeight: { body: 1.65, heading: 1.2 },
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    sectionDesktop: '5rem',
    sectionMobile: '2rem',
  },

  radius: {
    xs: '2px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    modal: '16px',
    pill: '50px',
    circle: '50%',
  },

  shadows: {
    subtle: '0 4px 24px rgba(15, 61, 35, 0.06)',
    card: '0 4px 24px rgba(15, 61, 35, 0.08)',
    elevated: '0 20px 60px rgba(15, 61, 35, 0.12)',
    overlay: '0 20px 60px rgba(15, 61, 35, 0.2)',
    focus: '0 0 0 3px rgba(127, 191, 58, 0.15)',
    cta: '0 6px 20px rgba(127, 191, 58, 0.35)',
    mobileMenu: '0 10px 40px rgba(0, 0, 0, 0.2)',
  },

  gradients: {
    hero: 'linear-gradient(160deg, #0A2E1A 0%, #0F3D23 40%, #163D26 100%)',
    section: 'linear-gradient(135deg, #0F3D23, #163D26)',
    accentGlow: 'radial-gradient(circle, rgba(127, 191, 58, 0.1) 0%, transparent 70%)',
  },

  breakpoints: { sm: '480px', md: '768px', lg: '1024px' },
  container: { max: '1200px', pad: '1.5rem', padMobile: '1rem' },
  zIndex: {
    base: 1, above: 2, navBackdrop: 98, dropdown: 99, stickyNav: 100,
    navLogo: 101, menuToggle: 102, skipLink: 200, modal: 200, mobileMenu: 999,
  },
  transitions: { fast: '0.15s', base: '0.2s', slow: '0.25s', slower: '0.3s', reveal: '0.6s' },

  logo: {
    symbol: '/assets/lemnion-mark.svg',
    horizontal: '/assets/lemnion-logo.svg',
    white: '/assets/lemnion-logo-white.svg',
    og: '/assets/logo-og.png',
    // mark geometry (shared by every Lemnion lockup):
    lemniscatePath:
      'M40 120 C0 120 0 40 40 40 C80 40 80 120 120 120 C160 120 160 40 120 40 C80 40 80 120 40 120 Z',
    gradient: ['#7FBF3A', '#B7E08A', '#7FBF3A'],
    wordmarkFont: "'Montserrat', Arial, sans-serif",
    wordmarkWeight: 700,
  },

  icons: {
    style: 'inline SVG, rounded strokes, stroke-width 2.5 for energy-flow lines',
    accent: '#7FBF3A',
    minSize: '24px',
  },

  components: {
    button: {
      minHeight: '44px',
      padding: '0.85rem 2rem',
      paddingSm: '0.5rem 0.85rem',
      radius: '50px',
      fontFamily: 'Montserrat',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
    card: {
      bg: '#FFFFFF', border: '1px solid #D4DDD0',
      radius: '20px', padding: '2rem', shadow: '0 4px 24px rgba(15, 61, 35, 0.06)',
    },
    form: {
      padding: '0.75rem 1rem', border: '1.5px solid #D4DDD0',
      radius: '8px', focusBorder: '#7FBF3A',
      focusRing: '0 0 0 3px rgba(127, 191, 58, 0.15)', placeholder: '#A0AEA0',
    },
  },
};

export default brand;
