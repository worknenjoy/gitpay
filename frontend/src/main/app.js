import React, { Component } from 'react'

import injectTabEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'

import './app.css'

injectTabEventPlugin()

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {open: false}
	}
	handleToggle() {
		this.setState({open: !this.open})
	}
	render() {
		return (
			<MuiThemeProvider>
				<div>
					<AppBar title='GitPay' 
						onLeftIconButtonTouchTap={() => this.handleToggle()} />
					<Drawer open={this.state.open} 
						docked={false} 
						onRequestChange={(open) => this.setState({open})} />
				</div>				
			</MuiThemeProvider>			
		)
	}
}

export default App