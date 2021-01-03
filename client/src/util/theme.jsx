import green from "@material-ui/core/colors/green";

export default {
  palette: {
    primary: {
      main: "#1A1A1D",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4569",
      main: "#ff1744",
      dark: "#b2102f",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    textTransform: "none",
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiTableFooter: {
      root: {
        left: 0,
        bottom: 0,
        zIndex: 2,
        position: "sticky",
      },
    },
    MuiTypography: {
      h3: {
        fontFamily: "Poppins",
      },
    },
    MuiPaper: {
      elevation4: {
        boxShadow: "none",
      },
    },
    MuiButton: {
      disableElevation: true,
      containedPrimary: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      },
      root: {
        borderRadius: 0,
      },
      contained: {
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      },
    },
  },
};
