import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import EnhancedTable from './EnhancedTable'
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextvariants: true
    }
})

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 150
    }
});

class Deallocate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networks: [],
            selectedNetwork: [],
            selectedNetworkIndex: 0
        }
    }
    handleChange = event => {
        this.setState({selectedNetwork: event.target.value});
        for (var index in this.state.networks) {
            if (this.state.selectedNetwork === this.state.networks[index].network_id) 
                this.setState({selectedNetworkIndex: index})
        }
    };

    componentDidMount() {
        fetch('http://localhost:40000/api/getUser?username=neha')
            .then(response => response.json())
            .then(json => json.user.networks)
            .then(networks => this.setState({networks, selectedNetwork: networks[0]}));
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Paper>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Typography variant="h6" align='left'>
                            Select network from list
                        </Typography>
                        <Select onChange={this.handleChange} value={this.state.selectedNetwork}>

                            {this
                                .state
                                .networks
                                .map((network) => {
                                    return <MenuItem value={network.network_id}>
                                        {network.network_id}
                                    </MenuItem>
                                })}

                        </Select>
                    </FormControl>
                </Paper>
                <EnhancedTable index={this.state.selectedNetworkIndex}/>
            </div>
        )
    }
}

export default withStyles(styles)(Deallocate);
