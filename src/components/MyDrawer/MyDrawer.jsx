import React, { useState } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalculateIcon from "@mui/icons-material/Calculate";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  ListItemButton,
} from "@mui/material";
import { Container } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
const drawerWidth = 248;
const useStyles = makeStyles({
  page: {
    backgroundColor: "#252525",
    width: "100%",
    color: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  displayHandler: {
    display: "flex",
  },
});
const menuItems = [
  {
    title: "Add Todos",
    path: "/",
    id: 1,
    icon: <NoteAddIcon />,
  },
  {
    title: "Show Todo List",
    path: "/show-todos",
    id: 2,
    icon: <ViewListIcon />,
  },
  {
    title: "count salary",
    path: "/salary",
    id: 3,
    icon: <CalculateIcon />,
  },
];

const MyDrawer = ({ children }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const listItems = (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton
            sx={{ color: "#0288D1" }}
            onClick={() => {
              navigate(`${item.path}`);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon sx={{ color: "#0288D1" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <React.Fragment>
      <IconButton
        color="info"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          display: { sm: "block", md: "none", xs: "block" },
          height: "20px",
          ml: "-10px",
          mt: "-10px",
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <div className={`${classes.displayHandler} ${classes.page}`}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#191919",
            },
          }}
        >
          {listItems}
        </Drawer>

        <Drawer
          className={classes.displayHandler}
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              backgroundColor: "#191919",
            },
          }}
          variant="permanent"
          anchor="left"
          elevation={2}
        >
          <div>
            <Typography
              variant="h4"
              sx={{
                textTransform: "capitalize",
                textAlign: "center",
                color: "#0288D1",
              }}
            >
              my dashboard
            </Typography>
            {listItems}
          </div>
        </Drawer>
        <div>
          <Container component={"main"} className={classes.page}>
            {children}
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};
export default MyDrawer;
