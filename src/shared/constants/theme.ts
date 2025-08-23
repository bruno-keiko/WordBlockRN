export const theme = {
    colors: {
      primary: "#C7F530",
      white: "#FFFFFF",
      background: "#17181A",
      backgroundSecondary: "#212224ff",
      foreground: "#FFFFFF",
      foregroundSecondary: "#0A0A0A",
      yellow: "#FFCC00",
      secondary: "#A3A3A3",
      red: "#FF3C31",
      black: "#000000",
    },
    fonts: {
      regular: "regular",
      medium: "medium",
      semiBold: "semibold",
      bold: "bold",
    },
  } as const;
  
  export type TColor = keyof typeof theme.colors;
  export type TFont = keyof typeof theme.fonts;