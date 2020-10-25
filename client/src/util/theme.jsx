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
      light: "#ed4b82",
      main: "#e91e63",
      dark: "#a31545",
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
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
  shape: {
    borderRadius: 0,
  },
};
