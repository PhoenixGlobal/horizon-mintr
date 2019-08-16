import themeLight from './light';
import themeDark from './dark';

const fontFamilies = {
  regular: 'apercu-regular',
  medium: 'apercu-medium',
  bold: 'apercu-bold',
};

const theme = mode => {
  const colorStyles = mode === 'dark' ? themeDark : themeLight;
  const textStyles = {
    h1: {
      as: 'h1',
      fontSize: [32],
      letterSpacing: 2,
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
      m: '30px 0px 8px 0px',
    },
    h2: {
      as: 'h2',
      fontSize: [24],
      letterSpacing: 2,
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
      m: '30px 0px 20px 0px',
    },
    pageTitle: {
      as: 'h3',
      fontSize: [18, 22, 24],
      fontWeight: 500,
      lineHeight: ['18px', '22px', '16px'],
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
    },
    h4: {
      as: 'h4',
      fontSize: [22],
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
    },
    h5: {
      as: 'h5',
      fontSize: [14, 16, 18],
      letterSpacing: 1,
      fontFamily: fontFamilies.medium,
      color: colorStyles.heading,
      m: '0px 0px 32px 0px',
    },
    h6: {
      as: 'h6',
      fontSize: [20],
      lineHeight: ['28px'],
      fontFamily: fontFamilies.regular,
      color: colorStyles.body,
      m: '24px 0px 0px 0px',
    },
    pageSubtitle: {
      as: 'p',
      fontSize: [12, 14, 16],
      fontWeight: 400,
      lineHeight: ['14px', '18px', '24px'],
      fontFamily: fontFamilies.regular,
      color: colorStyles.body,
    },
    buttonTertiary: {
      as: 'span',
      fontSize: [10, 12, 14],
      lineHeight: ['12px', '14px', '16px'],
      fontWeight: 400,
      fontFamily: fontFamilies.regular,
      color: colorStyles.subtext,
    },
    chartData: {
      as: 'span',
      fontSize: [10, 12, 14],
      lineHeight: ['12px', '14px', '16px'],
      fontWeight: 600,
      fontFamily: fontFamilies.regular,
      color: colorStyles.heading,
    },
    figure: {
      as: 'span',
      fontSize: [16, 24, 32],
      lineHeight: ['16px', '24px', '32px'],
      fontWeight: 500,
      fontFamily: fontFamilies.medium,
      color: colorStyles.body,
      letterSpacing: 1,
      m: '0px 0px 8px 0px'
    }
  };
  return { textStyles, colorStyles };
};

export default theme;
