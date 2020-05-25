import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircle from "@material-ui/icons/AddCircle";
import FileCopy from "@material-ui/icons/FileCopy";
import Archive from "@material-ui/icons/Archive";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import TouchApp from "@material-ui/icons/TouchApp";
import { Link } from "react-router-dom";

import Form from "../form";
import Client from "../client";
import Blotter from "../blotter";
import Manualinput from "../manualinput";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Fdashboard extends React.Component {
  state = {
    open: false,
    openForm: true,
    openTrades: false,
    openBlotter: false,
    openManual: false,
  };

  handleFormOpen = () => {
    this.setState({
      openForm: true,
      openTrades: false,
      openBlotter: false,
      openManual: false,
    });
  };

  handleTradesOpen = () => {
    this.setState({
      openForm: false,
      openTrades: true,
      openBlotter: false,
      openManual: false,
    });
  };

  handleBlotterOpen = () => {
    this.setState({
      openForm: false,
      openTrades: false,
      openBlotter: true,
      openManual: false,
    });
  };

  handleManualOpen = () => {
    this.setState({
      openForm: false,
      openTrades: false,
      openBlotter: false,
      openManual: true,
    });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  // componentWillUnmount() {
  //   localStorage.clear();
  // }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              BPI
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {!localStorage.token && (
              <ListItem button component={Link} to="/login">
                <ListItemIcon>
                  <TouchApp />
                </ListItemIcon>
                <ListItemText primary={"Login"} />
              </ListItem>
            )}
            <ListItem button component={Link} to="/form">
              <ListItemIcon>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary={"Form"} />
            </ListItem>
            {/* <ListItem button component={Link} to="/transactions"> */}
            <ListItem button component={Link} to="/transactions">
              <ListItemIcon>
                <Archive />
              </ListItemIcon>
              <ListItemText primary={"Transactions"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={this.handleManualOpen}>
              <ListItemIcon>
                <LibraryAdd />
              </ListItemIcon>
              <ListItemText primary={"Manual Form"} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={this.handleBlotterOpen}>
              <ListItemIcon>
                <FileCopy />
              </ListItemIcon>
              <ListItemText primary={"Blotter"} />
            </ListItem>
          </List>
          <List>
            <ListItem button onClick={this.handleTradesOpen}>
              <ListItemIcon>
                <MonetizationOn />
              </ListItemIcon>
              <ListItemText primary={"Invoice"} />
            </ListItem>
          </List>
          {/* <List>
            <ListItem button key={"NA"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"NA"} />
            </ListItem>
          </List> */}
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {/* {this.state.openForm && <Form />} */}
          {this.state.openTrades && <Client />}
          {this.state.openBlotter && <Blotter {...this.props} />}
          {this.state.openManual && <Manualinput />}
          {this.props.children}
        </main>
      </div>
    );
  }
}

Fdashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Fdashboard);
