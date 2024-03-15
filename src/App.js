import React, {Component} from 'react';
import './App.css';
import PersistentDrawer from './components/Drawer/PersistentDrawer'
import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        useNextvariants: true
    }
})

class App extends Component {

    render() {
        return (
            <div className="App">
                <PersistentDrawer/>
            </div>
        );
    }
}

export default App;
