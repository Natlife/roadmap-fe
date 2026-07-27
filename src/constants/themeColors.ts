// ==============================|| SYSTEM BRAND COLOR ENUMS & RAMPS ||============================== //

/**
 * System Accent / Brand Color Tones
 */
export enum BrandColorTone {
  GREEN = 'green',
  BLUE = 'blue',
  ORANGE = 'orange'
}

/**
 * Main Hex Codes for system brand colors
 */
export enum BrandColorHex {
  GREEN = '#4EB748',
  BLUE = '#124DA3',
  ORANGE = '#F37022'
}

export interface ColorRampStop {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
}

/**
 * Complete color ramps for each system brand tone
 */
export const BRAND_COLOR_RAMPS: Record<BrandColorTone, ColorRampStop> = {
  [BrandColorTone.GREEN]: {
    lighter: '#ebf7eb',
    light: '#79cd74',
    main: '#4EB748',
    dark: '#3a9635',
    darker: '#246b20',
    contrastText: '#ffffff'
  },
  [BrandColorTone.BLUE]: {
    lighter: '#e6effb',
    light: '#4278cb',
    main: '#124DA3',
    dark: '#0b377a',
    darker: '#05204d',
    contrastText: '#ffffff'
  },
  [BrandColorTone.ORANGE]: {
    lighter: '#feefe6',
    light: '#f79457',
    main: '#F37022',
    dark: '#c9520b',
    darker: '#8c3400',
    contrastText: '#ffffff'
  }
};
