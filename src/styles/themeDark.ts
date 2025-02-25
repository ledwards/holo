import colors from './colors';

const foregroundColor = colors.white;
const backgroundColor = colors.black;
const secondaryForegroundColor = colors.light;
const secondaryBackgroundColor = colors.dark;

const themeDark = {
  name: 'dark',
  foregroundColor,
  backgroundColor,
  secondaryForegroundColor,
  secondaryBackgroundColor,
  disabledColor: colors.gray,
  iconColor: foregroundColor,

  translucentBackgroundColor: colors.alphaBlack,
  dividerColor: colors.black,
  chipYesTextColor: colors.terminalGreen,
  chipNoTextColor: colors.red,
  chipYesBorderColor: colors.darkGreen,
  chipNoBorderColor: colors.darkRed,
  chipYesBackgroundColor: backgroundColor,
  chipNoBackgroundColor: backgroundColor,

  statusBarStyle: 'light-content',
};

export default themeDark;
