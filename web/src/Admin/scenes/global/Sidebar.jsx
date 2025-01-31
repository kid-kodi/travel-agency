import { useState } from "react";
import { Box, IconButton, Typography, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      <IconButton onClick={toggleSidebar}>
        <MenuOutlinedIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleSidebar}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            width: 240,
          },
        }}
      >
        <Box
          sx={{
            padding: "10px 20px",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" color={colors.grey[100]}>
            ADMINIS
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <img
              alt="profile-user"
              width="80px"
              height="80px"
              src={`../../assets/user.png`}
              style={{ cursor: "pointer", borderRadius: "50%" }}
            />
          </Box>
          <Typography variant="h6" color={colors.greenAccent[500]}>
            Ed Roh
          </Typography>
        </Box>

        <List>
          <ListItem button component={Link} to="/admin">
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/team">
            <ListItemIcon>
              <PeopleOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Team" />
          </ListItem>
          <ListItem button component={Link} to="/contacts">
            <ListItemIcon>
              <ContactsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Contacts Information" />
          </ListItem>
          <ListItem button component={Link} to="/invoices">
            <ListItemIcon>
              <ReceiptOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Invoices Balances" />
          </ListItem>

          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Pages
          </Typography>

          <ListItem button component={Link} to="/form">
            <ListItemIcon>
              <PersonOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile Form" />
          </ListItem>
          <ListItem button component={Link} to="/calendar">
            <ListItemIcon>
              <CalendarTodayOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button component={Link} to="/faq">
            <ListItemIcon>
              <HelpOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="FAQ Page" />
          </ListItem>

          <Typography variant="h6" color={colors.grey[300]} sx={{ m: "15px 0 5px 20px" }}>
            Charts
          </Typography>

          <ListItem button component={Link} to="/bar">
            <ListItemIcon>
              <BarChartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Bar Chart" />
          </ListItem>
          <ListItem button component={Link} to="/pie">
            <ListItemIcon>
              <PieChartOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Pie Chart" />
          </ListItem>
          <ListItem button component={Link} to="/line">
            <ListItemIcon>
              <TimelineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Line Chart" />
          </ListItem>
          <ListItem button component={Link} to="/geography">
            <ListItemIcon>
              <MapOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Geography Chart" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
