import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});


const font1 = "'Nunito', sans-serif";
const font2 = "'Nunito', sans-serif";
// Create a theme instance.
let theme = createTheme({
  palette: {
    common: {
        black: "#4b4b4b",
        white: "#ffffff",
    },
    primary: {
      dark: "#2e1042",
      main: "#462964",
      light: "#543977",
      contrastText: "#ffffff"
    },
    secondary: {
      dark: "#244210",
      main: "#426f25",
      light: "#578d34",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ff4b4b",
    },
    warning: {
      main: "#ff4b4b",
    },
    info: {
      main: "#ce82ff",
    },
    success: {
      main: "#1cb0f6",
    },
    background: {
      paper: "#2e1042",
      default: "#150F1D",
    },
    text: {
      primary: "#4b4b4b",
    },
  },


});

theme = createTheme(theme, {
    palette: {
      primary: {
        fade: "#c6c1d6",
      },
      secondary: {
        fade: "#e8f0e4",
      },
        color1: {
            dark: "#1cb0f6",
            main: "#1cb0f6",
            light: "#1cb0f6",
            fade: "#1cb0f6",
        },
    },
    typography: {
        fontFamily: font2,
        
        h1: {
          fontFamily: font1,
          margin: "1rem 0",
          textAlign: "center",
          [theme.breakpoints.down('md')]: {
            fontSize: '2rem',
            fontWeight: 700,
          },
          
        },
        h2: {
          fontFamily: font1,
          margin: "1rem 0",
          textAlign: "center",
          [theme.breakpoints.down('md')]: {
            fontSize: '1.75rem',
            fontWeight: 700,
          },
        },
        h3: {
          fontFamily: font1,
          [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem',
            fontWeight: 700,
          },
          margin: "0.5rem 0",
        },
        h4: {
          fontFamily: font1,
          margin: "0.5rem 0",
        },
        h5: {
          fontFamily: font1,
          margin: "0.5rem 0",
        },
        h6: {
          fontFamily: font1,
          margin: "0.5rem 0",
        },
        button: {
          fontFamily: font1,
          fontSize: "1.25rem",
        },
      },
    
  components: {
    MuiCssBaseline: {
      styleOverrides: `
            html: {
                box-sizing: border-box;
            }

            *, *::after, *::before {
                box-sizing: inherit;
            }

            a {
              text-decoration: none
            }
        `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: theme.palette.background.paper,
          // color: theme.palette.primary.main,
          paddingTop: "0.5rem",
          paddingBottom: "1rem",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
            borderRadius: "12px",
            fontSize: "1.25rem",
            fontWeight: 700,
            my: 1,
            p: 2,
            
        },
        text: {
          color: "#1cb0f6"
        },
        contained: {
            background: theme.palette.secondary.main,
            [theme.breakpoints.down('sm')]: {
                fontSize: "1rem",
            },
            boxShadow: "none",
            borderBottom: "3px solid" + theme.palette.secondary.dark,
            "&:hover": {
              bgcolor: theme.palette.secondary.main
            }
        },
        outlined: {
            border: `2px solid #e5e5e5`,
            borderBottom: `3px solid #e5e5e5`,
            color: theme.palette.secondary.contrastText,
            textTransform: "lowercase",

            "&:hover": {
                border: `2px solid ${theme.palette.secondary.main}`,
                borderBottom: `3px solid ${theme.palette.secondary.main}`,
                color: theme.palette.secondary.main,
                background: "",
            }
        }

      },
    },
    MuiLink: {
      styleOverrrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },

    
  },
});

export default theme;
