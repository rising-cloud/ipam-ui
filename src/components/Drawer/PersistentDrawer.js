import React from 'react';

import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Allocate from '../Allocate'
import Assign from '../Assign'
import Account from '../Account'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Deallocate from '../Deallocate';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    appFrame: {
        height: 700,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%'
    },
    appBar: {
        position: 'absolute',
        transition: theme
            .transitions
            .create([
                'margin', 'width'
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme
            .transitions
            .create([
                'margin', 'width'
            ], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
    },
    'appBarShift-left': {
        marginLeft: drawerWidth
    },
    'appBarShift-right': {
        marginRight: drawerWidth
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: 'none'
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme
            .transitions
            .create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
    },
    'content-left': {
        marginLeft: -drawerWidth
    },
    'content-right': {
        marginRight: -drawerWidth
    },
    contentShift: {
        transition: theme
            .transitions
            .create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
    },
    'contentShift-left': {
        marginLeft: 0
    },
    'contentShift-right': {
        marginRight: 0
    }
});

class PersistentDrawer extends React.Component {
    state = {
        open: false,
        anchor: 'left'
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleChangeAnchor = event => {
        this.setState({anchor: event.target.value});
    };

    render() {
        const {classes} = this.props;
        const {anchor, open} = this.state;

        const customDrawer = (
            <Drawer
                variant="persistent"
                anchor={anchor}
                open={open}
                classes={{
                paper: classes.drawerPaper
            }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <div>
                        <Link to="dashboard">
                            <ListItem button>
                                <ListItemText primary="Dashboard" onClick={this.handleDrawerClose}/>
                            </ListItem>
                        </Link>
                        <Link to="allocate">
                            <ListItem button>
                                <ListItemText primary="Allocate" onClick={this.handleDrawerClose}/>
                            </ListItem>
                        </Link>
                        <Link to="assign">
                            <ListItem button>
                                <ListItemText primary="Assign" onClick={this.handleDrawerClose}/>
                            </ListItem>
                        </Link>
                        <Link to="account">
                            <ListItem button>
                                <ListItemText primary="Account Details" onClick={this.handleDrawerClose}/>
                            </ListItem>
                        </Link>
                        <Link to="deallocate">
                            <ListItem button>
                                <ListItemText primary="Deallocate" onClick={this.handleDrawerClose}/>
                            </ListItem>
                        </Link>
                    </div>
                </List>
            </Drawer>
        );

        return (
            <Router>
                <div className={classes.root}>
                    <div className={classes.appFrame}>
                        <AppBar
                            className={classNames(classes.appBar, {
                            [classes.appBarShift]: open,
                            [classes[`appBarShift-${anchor}`]]: open
                        })}>
                            <Toolbar disableGutters={!open}>
                                <IconButton
                                    color="inherit"
                                    onClick={this.handleDrawerOpen}
                                    className={classNames(classes.menuButton, open && classes.hide)}>
                                    <MenuIcon/>
                                </IconButton>

                            </Toolbar>
                        </AppBar>
                        {customDrawer}
                        <main
                            className={classNames(classes.content, classes[`content-${anchor}`], {
                            [classes.contentShift]: open,
                            [classes[`contentShift-${anchor}`]]: open
                        })}>
                            <div className={classes.drawerHeader}/> {/*<Router history={hashHistory} routes={appRoutes}/>*/}
                            <Redirect from="/" to="/dashboard"/>
                            <Route path="/dashboard" component={Dashboard}/>
                            <Route path="/allocate" component={Allocate}/>
                            <Route path="/assign" component={Assign}/>
                            <Route path="/account" component={Account}/>
                            <Route path="/deallocate" component={Deallocate}/>
                        </main>
                    </div>
                </div>
            </Router>
        );
    }
}

export default withStyles(styles, {withTheme: true})(PersistentDrawer);