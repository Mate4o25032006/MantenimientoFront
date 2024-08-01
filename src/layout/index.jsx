import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material"

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#e3f2fd',
    },
  },
});

export const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box 
        sx={{
          display: 'flex',
          minHeight: '100vh', // Asegura que el fondo cubra toda la altura de la pantalla
          // backgroundImage: 'url(/src/assets/ImagenFondo.jpg)', // Reemplaza con la ruta a tu imagen
          // backgroundSize: '100%', // Ajusta el tamaño de la imagen a la mitad
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
        }}
      >
        <CssBaseline />
          {children}
      </Box>
    </ThemeProvider>
  );
};
