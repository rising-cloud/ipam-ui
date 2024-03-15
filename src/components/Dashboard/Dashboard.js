import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from './Cards/Card'

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    control: {
        padding: theme.spacing.unit * 2
    }
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spacing: '16',
            networks: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:40000/api/getUser?username=neha')
            .then(response => response.json())
            .then(json => json.user.networks)
            .then(networks => this.setState({networks}))
    }

    render() {
        const {classes} = this.props;
        const {spacing} = this.state;

        return (
            <Grid container className={classes.root} spacing={16}>
                <Grid item xs={12}>
                    <Grid
                        container
                        className={classes.demo}
                        justify="center"
                        spacing={Number(spacing)}>
                        {this
                            .state
                            .networks
                            .map((network, i) => (
                                <Grid key={i} item>
                                    <Card network={network}/>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Dashboard);
