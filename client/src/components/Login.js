import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  connect = async e => {
    e.preventDefault();

    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const credentials = {
      email: this.state.email,
      password: this.state.password,
    }

    if (credentials.email && credentials.email.match(emailRegex) && credentials.password) {
      try {
        const { data: connected } = await axios.post('/login', credentials);

        console.log(connected);

        if (connected) {
          if (this.props.onConnect) {
            this.props.onConnect();
          }

          return;
        }

        this.invalidCredentials();
      } catch (e) {
        console.log(e);
        this.invalidCredentials();
      }
    }
  }

  invalidCredentials = () => {
    console.log('Invalid credentials');
  }

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    return (
      <form method="POST" action="/login" onSubmit={this.connect}>
        <input type="email" name="email" onChange={this.onChange} />
        <input type="password" name="password" onChange={this.onChange} />
        <button type="submit">Login</button>
      </form>
    );
  }
}