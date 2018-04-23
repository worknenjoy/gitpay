// CardSection.js
import React from 'react';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import AccountCircle from 'material-ui-icons/AccountCircle';
import MailIcon from 'material-ui-icons/Mail';


class UserSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: {
        fullname: false,
        email: false
      }
    }

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

  }

  componentWillReceiveProps(props, newProps) {
    this.setState({
      error: props.error
    })
  }

  onChangeName(ev) {
    if(ev.target.value.length < 1) {
      this.setState({error: {fullname:  true }});
    } else {
      this.setState({error: {fullname:  false }});
    }
  }

  onChangeEmail(ev) {
    if(ev.target.value.length < 1) {
      this.setState({error: {email:  true }});
    } else {
      this.setState({error: {email:  false }});
    }
  }

  render() {
    return (
      <label>
        <FormControl error={this.state.error.fullname}>
          <Input
            id="payment-form-user"
            name="fullname"
            startAdornment={<InputAdornment position="start"><AccountCircle /></InputAdornment>}
            placeholder="nome completo"
            ref="payment-form-user"
            required={true}
            style={{marginRight: 20}}
            onChange={this.onChangeName}
          />
          { this.state.error.fullname &&
          <FormHelperText error={this.state.error.fullname}>Insira o seu nome completo</FormHelperText>
          }
        </FormControl>
        <FormControl error={this.state.error.email}>
          <Input
            name="email"
            id="adornment-email"
            startAdornment={<InputAdornment position="start"><MailIcon /></InputAdornment>}
            placeholder="e-mail"
            ref="payment-form-email"
            type="email"
            required={true}
            onChange={this.onChangeEmail}
          />
          { this.state.error.email &&
          <FormHelperText error={this.state.error.email}>Insira seu e-mail</FormHelperText>
          }
        </FormControl>
      </label>
    );
  }
};

export default UserSection;
