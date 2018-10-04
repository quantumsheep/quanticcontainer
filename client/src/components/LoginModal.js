import React, { Component } from 'react';
import axios from 'axios';

import helpers from '../helpers';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    isLogin: true,
  }

  connect = async e => {
    e.preventDefault();

    const credentials = {
      email: this.state.email,
      password: this.state.password,
    }

    if (credentials.email && helpers.isEmail(credentials.email) && credentials.password) {
      try {
        const { data: connected } = await axios.post('/login', credentials);

        console.log(connected);

        if (connected) {
          if (this.props.onConnect) {
            this.props.onConnect();
          }

          if(this.props.onClose) {
            this.props.onClose();
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

  signup = async e => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    }

    if (user.email && helpers.isEmail(user.email) && user.username && helpers.isValidUsername(user.username) && user.password) {
      try {
        const { data: done } = await axios.post('/register', user);

        if (done) {
          this.switch();

          return;
        }

        this.invalidCredentials();
      } catch (e) {
        console.log(e);
        this.invalidCredentials();
      }
    }
  }

  switch = e => {
    e.preventDefault();

    this.setState({ isLogin: !this.state.isLogin });
  }

  invalidCredentials = () => {
    console.log('Invalid credentials');
  }

  onChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    const { open = false, onClose = () => { } } = this.props;

    return (
      <div className={"modal" + (!open ? " hidden" : "")}>
        <div className="back" onClick={onClose}></div>
        <div className="modal-content">
          <form method="POST" action="/login" onSubmit={this.connect} className={(!this.state.isLogin ? "hidden" : "")}>
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" onChange={this.onChange} />
            <input type="password" name="password" placeholder="Password" onChange={this.onChange} />
            <div className="flex space-between align-end">
              <span>No account? <a href="#!" onClick={this.switch}>Signup here</a>.</span>
              <button type="submit">Login</button>
            </div>
          </form>

          <form method="POST" action="/signup" onSubmit={this.signup} className={(this.state.isLogin ? "hidden" : "")}>
            <h2>Signup</h2>
            <input type="email" name="email" placeholder="Email" onChange={this.onChange} />
            <input type="text" name="username" placeholder="Username" onChange={this.onChange} />
            <input type="password" name="password" placeholder="Password" onChange={this.onChange} />
            <div className="flex space-between align-end">
              <span>Already have an account? <a href="#!" onClick={this.switch}>Login here</a>.</span>
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}