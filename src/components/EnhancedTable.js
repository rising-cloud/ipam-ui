import React from 'react';
import classNames from 'classnames';

import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextvariants: true
    }
})

let counter = 0;
function createData(address) {
    counter += 1;
    return {
        id: counter,
        IP: address.ipaddress,
        hostname: address.hostname,
        gateway: address.gateway,
        in_use: address.in_use
            ? 'true'
            : 'false',
        pingable: address.pingable
            ? 'true'
            : 'false'
    };
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) 
            return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => desc(a, b, orderBy)
        : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    {
        id: 'IP',
        numeric: false,
        disablePadding: true,
        label: 'IP'
    }, {
        id: 'hostname',
        numeric: true,
        disablePadding: false,
        label: 'Hostname'
    }, {
        id: 'gateway',
        numeric: true,
        disablePadding: false,
        label: 'Gateway'
    }, {
        id: 'in_use',
        numeric: true,
        disablePadding: false,
        label: 'In Use'
    }, {
        id: 'pingable',
        numeric: true,
        disablePadding: false,
        label: 'Pingable'
    }
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this
            .props
            .onRequestSort(event, property);
    };

    render() {
        const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}/>
                    </TableCell>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding
                                ? 'none'
                                : 'default'}
                                sortDirection={orderBy === row.id
                                ? order
                                : false}>
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric
                                    ? 'bottom-end'
                                    : 'bottom-start'}
                                    enterDelay={300}>
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}>
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit
    },
    highlight: theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
        },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    }
});

let EnhancedTableToolbar = props => {
    const {numSelected, classes} = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
            [classes.highlight]: numSelected > 0
        })}>
            <div className={classes.title}>
                {numSelected > 0
                    ? (
                        <Typography color="inherit" variant="subtitle1">
                            {numSelected}
                            selected
                        </Typography>
                    )
                    : (
                        <Typography variant="h6" align='center'>
                            Allocations
                        </Typography>
                    )}
            </div>
            <div className={classes.spacer}/>
        </Toolbar>
    );
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    },
    table: {
        minWidth: 1020
    },
    tableWrapper: {
        overflowX: 'auto'
    }
});

class EnhancedTable extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            order: 'asc',
            orderBy: 'IP',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 5
        };
    }

    componentDidMount() {
        fetch('http://localhost:40000/api/getUser?username=neha')
            .then(response => response.json())
            .then(json => json.user.networks)
            .then(networks => {
                this.setState({
                    data: networks[this.props.index]
                        .ip_pool
                        .map((address) => {
                            return createData(address);
                        })
                })
                console.log(networks[this.props.index])
            })
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({
                selected: state
                    .data
                    .map(n => n.id)
            }));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this
        .state
        .selected
        .indexOf(id) !== -1;

    render() {
        const {classes} = this.props;
        const {
            data,
            order,
            orderBy,
            selected,
            rowsPerPage,
            page
        } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar numSelected={selected.length}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}/>
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, n.id)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected}/>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.IP}
                                            </TableCell>
                                            <TableCell numeric>{n.hostname}</TableCell>
                                            <TableCell numeric>{n.gateway}</TableCell>
                                            <TableCell numeric>{n.in_use}</TableCell>
                                            <TableCell numeric>{n.pingable}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                    height: 49 * emptyRows
                                }}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                    'aria-label': 'Previous Page'
                }}
                    nextIconButtonProps={{
                    'aria-label': 'Next Page'
                }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
            </Paper>
        );
    }
}

export default withStyles(styles)(EnhancedTable);