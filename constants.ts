export const constants = {
  routes: {
    LOGIN: '/login',
    OVERVIEW: '/overview',
    // Removed: ORDERS: '/orders', // Removed per request
    // Removed: MENU: '/menu', // Removed per request
    BRANCHES: '/branches',
    STAFF: '/staff',
    ROLE_ACCESS: '/roles-access',
    REPORTS: '/reports',
    BRANDING: '/branding',
    SETTINGS: '/settings',
  },
  colors: {
    PRIMARY: 'offoOrange',
    SECONDARY: 'offoDark', // Used for sidebar, login screen elements
    ACCENT_GRAY: 'offoSlate', // Secondary text color
    TEXT_DARK: 'offoTextDark', // Primary text on light backgrounds
    TEXT_LIGHT: 'offoTextLight', // Primary text on dark backgrounds
    BG_LIGHT: 'offoPrimaryBg', // Main content area background
    BG_DARK: 'offoDark', // Sidebar and Login Screen background
    BG_CARD_LIGHT: 'offoCardBgLight', // General card background
    BG_STAT_DARK: 'offoStatCardBgDark', // Dashboard stat card background
  },
  navbarHeight: '64px',
  sidebarWidth: '250px',
  // Removed logoUrl as we are using text-based branding now
};