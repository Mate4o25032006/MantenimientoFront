import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LaptopIcon from '@mui/icons-material/Laptop';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DvrIcon from '@mui/icons-material/Dvr';
import { styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Estilo personalizado para ListItemButtonBlue
const ListItemButtonBlue = styled(ListItemButton)(({ theme, selected }) => ({
  backgroundColor: selected ? "#bbdefb" : "transparent",
  "&:hover": {
    backgroundColor: "#bbdefb",
  },
}));

const CustomListItem = ({ to, icon, text }) => {
  const location = useLocation();
  const isSelected = location.pathname === to;

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <ListItemButtonBlue selected={isSelected}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} primaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }} />
      </ListItemButtonBlue>
    </Link>
  );
};

export const mainListItems = (
  <React.Fragment>
    <CustomListItem to="/admin" icon={<HomeIcon color='primary' />} text="Inicio" />
    <CustomListItem to="/equipos/lista" icon={<LaptopIcon color='primary' />} text="Equipos" />
    <CustomListItem to="/mantenimientos/lista" icon={<EngineeringIcon color='primary' />} text="Mantenimiento" />
    <CustomListItem to="/usuarios/lista" icon={<PeopleIcon color='primary' />} text="Usuarios" />
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <CustomListItem to="/formularios" icon={<AssignmentIcon color='primary' />} text="Formularios" />
    <CustomListItem to="/listas" icon={<ListAltIcon color='primary' />} text="Listas" />
    <CustomListItem to="/asignacionRoles" icon={<AssignmentIndIcon color='primary' />} text="Asignación roles" />
    <CustomListItem to="/asignacionEquipos" icon={<DvrIcon color='primary' />} text="Asignación equipos" />
  </React.Fragment>
);
