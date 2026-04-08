/**
 * Design tokens — import these instead of hardcoding values in style objects.
 * All component styling uses inline React style objects referencing these constants.
 */
export const COLORS = {
  bg:            '#0a0a0f',
  bgPanel:       '#12121a',
  accent:        '#f5a623',
  accentHover:   '#e09415',
  success:       '#4caf50',
  danger:        '#e53935',
  textPrimary:   '#ffffff',
  textSecondary: '#aaaaaa',
  border:        '#2a2a3a',
  nodeDefault:   '#1e1e2e',
  nodeLocked:    '#0d0d14',
  nodeComplete:  '#1a3a1a',
  nodeActive:    '#2a1a00',
}

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   24,
  xxl:  32,
}

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  40,
  xxl: 64,
}

export const RADIUS = {
  sm:  6,
  md:  12,
  lg:  20,
  full: 9999,
}
