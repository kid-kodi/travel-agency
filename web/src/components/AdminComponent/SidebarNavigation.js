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
    segment: 'admin/promotion',
    title: 'Promotion',
    icon: <LocalOfferIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Rapports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Ventes',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Trafic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Intégrations',
    icon: <LayersIcon />,
  },
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
