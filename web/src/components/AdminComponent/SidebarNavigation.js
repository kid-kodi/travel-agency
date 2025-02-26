import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RouteIcon from '@mui/icons-material/AltRoute';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LayersIcon from '@mui/icons-material/Layers';
import HailIcon from '@mui/icons-material/Hail';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// Définir la configuration de la navigation
export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'admin/reservation',
    title: 'Réservation',
    icon: <BookOnlineIcon />,
  },
  {
    segment: 'admin/trajet',
    title: 'Trajet',
    icon: <RouteIcon />,
  },
  {
    segment: 'admin/vehicule',
    title: 'Véhicule',
    icon: <DirectionsBusIcon />,
  },
  {
    segment: 'admin/conducteur',
    title: 'Conducteur',
    icon: <PersonIcon />,
  },
  {
    segment: 'admin/paiement',
    title: 'Paiement',
    icon: <PaymentIcon />,
  },
  {
    segment: 'admin/admins',
    title: 'Nos Admins',
    icon: <ManageAccountsIcon />,
  },
  {
    segment: 'admin/client',
    title: 'Nos Clients',
    icon: <HailIcon />,
  },
  // {
  //   segment: 'admin/promotion',
  //   title: 'Promotion',
  //   icon: <LocalOfferIcon />,
  // },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Parametrage',
  },
  {
    segment: 'admin/ville',
    title: 'Villes',
    icon: <GpsFixedIcon />,
  },
  {
    segment: 'admin',
    title: 'Rapports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'planing',
        title: 'Planification',
        icon: <FactCheckIcon />,
      },
      {
        segment: 'traffic',
        title: 'Trafic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'admin/logout',
    title: 'Deconnexion',
    icon: <LogoutIcon />,
  }
];

// Composant SidebarNavigation qui génère la navigation dynamique
function SidebarNavigation() {
  return (
    <List>
      {NAVIGATION.map((item, index) => {
        // Si l'élément est un en-tête, on affiche le titre
        if (item.kind === 'header') {
          return (
            <ListItem key={index}>
              <ListItemText primary={item.title} />
            </ListItem>
          );
        }

        // Si l'élément est un séparateur, on l'affiche
        if (item.kind === 'divider') {
          return <Divider key={index} />;
        }

        // Si l'élément a un segment, on le transforme en lien de navigation avec le préfixe 'admin:'
        if (item.segment) {
          return (
            <ListItem button component={Link} to={`${item.segment}`} key={index}>
              <ListItemText primary={item.title} />
              {item.icon && item.icon}
            </ListItem>
          );
        }

        return null;
      })}
    </List>
  );
}

export default SidebarNavigation;
