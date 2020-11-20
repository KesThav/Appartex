import green from "@material-ui/core/colors/green";

export default {
  palette: {
    primary: {
      light: "#116ec7",
      main: "#0b4781 ",
      dark: "#072C50",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4569",
      main: "#ff1744",
      dark: "#b2102f",
      contrastText: "#fff",
    },
    success: {
      main: green[500],
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    textTransform: "none",
  },
  props: {},
  /*   shape: {
    borderRadius: 0,
  }, */
  /* overrides: {
  }, */
  overrides: {
    MuiTableCell: {
      stickyHeader: {
        /* backgroundColor: "#ffff", */
      },
    },
    MuiTableFooter: {
      root: {
        left: 0,
        bottom: 0, // <-- KEY
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
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundColor: "#f4f6f8",
        },
      },
    },
    MuiButton: {
      disableElevation: true,
      containedPrimary: {
        background:
          "linear-gradient(90deg, rgba(154,0,255,1) 4%, rgba(11,71,129,1) 100%)",
      },
    },
  },
};

/**.MuiPaper-elevation4 */
