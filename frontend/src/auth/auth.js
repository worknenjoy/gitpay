import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Input from '../common/form/inputAuth'

class Auth extends Component {
	constructor(props) {
		super(props)

		this.state = { loginMode: true }
	}
	changeMode() {
		this.setState({ loginMode: !this.state.loginMode })
	}
	onSubmit(values) {
		const { login, signup } = this.props
		this.state.loginMode ? login(values) : signup(values)
	}
	render() {		
		return (
			<Card className='container'>
				<form onSubmit={handleSubmit(v => this.onSubmit(v))}>
					<h2 className='card-heading'>Login</h2>
					<div className='field-line'>
						<Field component={Input} label='Name' 
							type='input' hide={loginMode} />
                        <Field component={Input} label='E-mail' 
                        	type='input' name='name' hide={loginMode} />
                        <Field component={Input} label='Password' 
                        	type='password' />
                        <Field component={Input} label='Confirm password' 
                        	type='password' hide={loginMode} />                            
					</div>
					<div className='button-line'>
						<RaisedButton type='submit' label='Login' primary />
					</div>

					<CardText>
						<a onClick={() => this.changeMode()}>
	                        {loginMode ? 'New user? Register here!' :
	                            'Already registered?? Come in here!'}
						</a>
					</CardText>
				</form>
			</Card>
		)
	}
}

Auth = reduxForm({ form: 'authForm' })(Auth)
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup }, dispatch)
export default connect(null, mapDispatchToProps)(Auth)