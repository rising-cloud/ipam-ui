import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextvariants: true
  }
})

const styles = theme => ({
  paper: {
    // width: '50%'
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class Allocate extends Component{
    constructor(props){
        super(props)
        this.state = {
            username:'', //'neha'
            network_id: '', //'9.6.55.6'
            subnet_mask:'', //'255.255.255.0'
            cidr: '', //'24'
            ipRangeStart:'',
            ipRangeEnd: '',
            open: false,
            message: '',
            isSuccess: false
        };
    }

      handleUsernameChange = username => event => {
        this.setState({
          [username]: event.target.value,
        });
      };

      handleNetworkChange = network_id => event => {
        this.setState({
          [network_id]: event.target.value,
        });
      };
    
      handleSubnetMaskChange = subnet_mask => event => {
        this.setState({
          [subnet_mask]: event.target.value,
        });
      };

      handleCIDRChange = cidr => event => {
        this.setState({
          [cidr]: event.target.value,
        });
      };

      handleIPRangeStartChange = ipRangeStart => event => {
        this.setState({
          [ipRangeStart] : event.target.value,
        });
      };

      handleIPRangeEndChange = ipRangeEnd => event => {
        this.setState({
          [ipRangeEnd]: event.target.value,
        });
      };

      handleClick = (data) => {
        if(data.status === 200){
            this.setState({
                open: true,
                message : 'IP addresses are allocated successfully',
                username:'', 
                network_id: '', 
                subnet_mask:'',
                cidr: '',
                ipRangeStart:'',
                ipRangeEnd: '',
            });
        }
        else{
            this.setState({
                open: true,
                message :'IP addresses allocation failed',
                username:'',
                network_id: '', 
                subnet_mask:'', 
                cidr: '', 
                ipRangeStart:'',
                ipRangeEnd: '',
            });
        } 
      };
    
      handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ open: false });
      };

    allocate = (event) => {
        //event.preventDefault();    
        var self = this
        if(this.validateform()){
        fetch('http://localhost:40000/api/allocate', {
            method: 'post',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                network_id: this.state.network_id,
                subnet_mask: this.state.subnet_mask,
                cidr: this.state.cidr,
                ipRange: [this.state.ipRangeStart, this.state.ipRangeEnd]	
            })
        }).then(function(response) {
          if (response.status === 200) {
            self.setState({
              isSuccess: true
            });
            self.handleClick(response);
          }
          }).catch(function (e) {
            self.setState({
              isSuccess: false
            });
           self.handleClick(e.message);
        });
      }
      else{
        self.handleClick({
          status: undefined,
          message: 'Invalid inputs'
        });
      }
    }

    validateform = () => {
        var regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        var cidrcheck = true
        if(isNaN(this.state.cidr) || this.state.cidr < 8 || this.state.cidr > 32)
            cidrcheck = false
        
        if(/^[A-Za-z]\w*$/.test(this.state.username) && regex.test(this.state.ipRangeStart) && regex.test(this.state.ipRangeEnd) && 
        regex.test(this.state.network_id) && regex.test(this.state.subnet_mask) && cidrcheck)
            return true   
        else
            return false
        
    }

    render(){
        const {classes} = this.props;

        var buttonDisabled = (this.state.network_id && this.state.subnet_mask && this.state.username 
            && this.state.cidr && this.state.ipRangeEnd && this.state.ipRangeStart) ? false : true
      
        return(
        <div>
           <Paper className={classes.paper}>
            <form style={{display:'inline-grid',marginLeft:'60px'}}> 
            <TextField
              required
              id="standard-name"
              label="Username"
              style={{width:300}}
              ref={this.state.username}
              onChange={this.handleUsernameChange('username')}
              margin="normal"
            />
             <TextField
              required
              id="standard-name"
              label="Network"
              style={{width:300}}
              value={this.state.network_id}
              onChange={this.handleNetworkChange('network_id')}
              margin="normal"
            />
             <TextField
              required
              id="standard-name"
              label="Subnet Mask"
              style={{width:300}}
              value={this.state.subnet_mask}
              onChange={this.handleSubnetMaskChange('subnet_mask')}
              margin="normal"
            />
             <TextField
              required
              id="standard-name"
              label="CIDR"
              style={{width:300}}
              value={this.state.cidr}
              onChange={this.handleCIDRChange('cidr')}
              margin="normal"
            />
             <TextField
              required
              id="standard-name"
              label="IP Range-Start"
              style={{width:300}}
              value={this.state.ipRangeStart}
              onChange={this.handleIPRangeStartChange('ipRangeStart')}
              margin="normal"
            />
            <TextField
              required
              id="standard-name"
              label="IP Range-End"
              style={{width:300}}
              value={this.state.ipRangeEnd}
              onChange={this.handleIPRangeEndChange('ipRangeEnd')}
              margin="normal"
            />
            <Button variant="contained" disabled={buttonDisabled} color="primary" style={{marginTop:'20px', marginBottom:'20px'}} onClick={this.allocate} >
                 Allocate
            </Button>
            </form>
            </Paper>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
        </div>
        )
    }
}

export default withStyles(styles)(Allocate);
