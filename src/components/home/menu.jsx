import * as React from 'react';
import { useContext } from 'react';
import { Divider, IconButton, List, ListItemIcon, ListItemButton, ListItemText, Toolbar, Typography, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { mainListItems, secondaryListItems as originalSecondaryListItems } from './listItems';
import Logo1 from '../../assets/Sena1.png';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import { MantenContext } from '../../Context';


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomDivider = styled(Divider)(({ theme }) => ({
    borderBottomWidth: '4px', // Cambia el grosor aquí
    // borderColor: '#1976d2', // Cambia el color aquí
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export const Menu = () => {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const { setTokenSession } = useContext(MantenContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    setTokenSession(null); // Limpia el tokenSession
    navigate('/login'); // Ajusta esta ruta según tu configuración
  };

  const handleGoBack = () => {
    navigate(-1); // Regresa a la dirección anterior
  };

  const secondaryListItems = (
    <>
      {originalSecondaryListItems}
      <CustomDivider />
      <ListItemButton onClick={handleLogout} sx={{ mt: 52 }}>
        <ListItemIcon>
          <LogoutIcon color="primary" />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }} primary="Cerrar sesión" />
      </ListItemButton>
    </>
  );

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="primary"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon color='secondary'/>
          </IconButton>
          <IconButton
            edge="start"
            color="primary"
            aria-label="go back"
            onClick={handleGoBack}
            sx={{ marginRight: '16px' }}
          >
            <ArrowBackIcon color='secondary' />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="secondary"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Inicio
          </Typography>
          <img
            src={Logo1}
            alt="My Image"
            style={{ width: 60, height: 60, objectFit: 'cover' }}
          />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer} sx={{ "$hover": { backgroundColor: "#e3f2fd"} }}>
            <ChevronLeftIcon color='primary' />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
          <CustomDivider/>
          {secondaryListItems}
        </List>
      </Drawer>
    </>
  );
}
