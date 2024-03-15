import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextvariants: true
    }
})

class Assign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '', //'neha'
            network_id: '', //'9.6.55.6'
            count: '',
            open: false,
            message: ''
        };
    }

    handleUsernameChange = username => event => {
        this.setState({[username]: event.target.value});
    };

    handleNetworkChange = network_id => event => {
        this.setState({[network_id]: event.target.value});
    };

    handleCountChange = count => event => {
        this.setState({[count]: event.target.value});
    };

    handleClickOpen = (data) => {
        if (data.status === 200) {
            this.setState({open: true, message: 'IP addresses are assigned successfully', username: '', network_id: '', count: ''});
        } else {
            this.setState({open: true, message: 'IP addresses assignment failed', username: '', network_id: '', count: ''});
        }
    };

    handleClose = () => {
        this.setState({open: false});
    };

    assign = (event) => {
        //event.preventDefault();
        var self = this
        if (this.validateform()) {
            fetch('http://localhost:40000/api/assign', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify({username: this.state.username, network_id: this.state.network_id, count: this.state.count})
                })
                .then(function (response) {
                    if (response.status === 200) {
                        self.handleClickOpen(response);
                    }
                })
                .catch(function (e) {
                    self.handleClickOpen(e.message);
                });
        }
    }

    validateform = () => {
        var regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        var countcheck = true

        if (isNaN(this.state.count) || this.state.count > 10 || this.state.count < 0) 
            countcheck = false

        if (/^[A-Za-z]\w*$/.test(this.state.username) && regex.test(this.state.network_id) && countcheck) 
            return true
        else 
            return false

    }

    render() {
        var buttonDisabled = (this.state.network_id && this.state.username && this.state.count)
            ? false
            : true

        return (
            <div>
                <Paper>
                    <form
                        style={{
                        display: 'inline-grid',
                        marginLeft: '60px'
                    }}>
                        <TextField
                            required
                            id="standard-name"
                            label="Username"
                            style={{
                            width: 300
                        }}
                            value={this.state.username}
                            onChange={this.handleUsernameChange('username')}
                            margin="normal"/>
                        <TextField
                            required
                            id="standard-name"
                            label="Network"
                            style={{
                            width: 300
                        }}
                            value={this.state.network_id}
                            onChange={this.handleNetworkChange('network_id')}
                            margin="normal"/>
                        <TextField
                            required
                            id="standard-name"
                            label="Count"
                            style={{
                            width: 300
                        }}
                            value={this.state.count}
                            onChange={this.handleCountChange('count')}
                            margin="normal"/>

                        <Button
                            disabled={buttonDisabled}
                            variant="contained"
                            color="primary"
                            style={{
                            marginTop: '20px',
                            marginBottom: '20px'
                        }}
                            onClick={this.assign}>
                            Assign
                        </Button>
                    </form>
                </Paper>
            </div>
        )
    }
}
export default Assign