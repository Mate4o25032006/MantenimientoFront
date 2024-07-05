import * as React from 'react';
import { useContext } from 'react';
import { Divider, IconButton, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Toolbar, Typography, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { mainListItems, secondaryListItems as originalSecondaryListItems } from './listItems';
import Logo from '../../assets/Sena.png';
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
  const { admin } = useContext(MantenContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // // Aquí puedes agregar la lógica de cierre de sesión
    // admin = false;
    // localStorage.removeItem('authToken'); // o la clave que estés utilizando para almacenar el token
    // navigate('/login'); // Ajusta esta ruta según tu configuración
  };

  const secondaryListItems = (
    <>
      {originalSecondaryListItems}
      <Divider sx={{ my: 1 }} />
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Cerrar sesión" />
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
            src={Logo}
            alt="My Image"
            style={{ width: 50, height: 50, objectFit: 'cover' }}
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
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
        </List>
      </Drawer>
    </>
  );
}
