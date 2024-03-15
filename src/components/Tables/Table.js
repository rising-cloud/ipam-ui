import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        width: '95%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 700
    }
});

/*let id = 0;
function createData(ipaddress, network, gateway, hostname, in_use) {
  id += 1;
  return { id, ipaddress, network, gateway, hostname, in_use };
}
*/

/*const rows = [
  createData('9.5.29.228', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.229', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.230', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.231', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.232', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.232', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.232', '9.5.29.0', '9.5.29.1', 'rochestor', 'false'),
  createData('9.5.29.232', '9.5.29.0', '9.5.29.1', 'rochestor', 'false')
];*/

class SimpleTable extends React.Component {

    render() {
        const {classes} = this.props;
        const {network} = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>IP_ADDRESS</TableCell>
                            <TableCell>NETWORK_ID</TableCell>
                            <TableCell>SUBNET_MASK</TableCell>
                            <TableCell>HOSTNAME</TableCell>
                            <TableCell>IN_USE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {network
                            .ip_pool
                            .map(row => {
                                return (
                                    <TableRow key={row.ipaddress}>
                                        <TableCell component="th" scope="row">
                                            {row.ipaddress}
                                        </TableCell>
                                        <TableCell>{network.network_id}</TableCell>
                                        <TableCell>{network.subnet_mask}</TableCell>
                                        <TableCell>{row.hostname}</TableCell>
                                        <TableCell>{row.in_use
                                                ? "true"
                                                : "false"}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withStyles(styles)(SimpleTable);
