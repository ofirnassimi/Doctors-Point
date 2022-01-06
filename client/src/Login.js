import React from "react";
import Axios from "axios";
import App from "./App";

class Login extends React.Component {
  guest = {id: 0, first_name: 'dear', last_name: 'guest'};

  constructor(props) {
    super(props);
    // props.setUser(this.guest)
    // this.setUser = props.setUser;
    this.state = {
      first_name: null,
      last_name: null,
      username: null,
      password: null,
      mode: this.guestMode,
    };

    this.toGuestMode = this.toGuestMode.bind(this)
    this.toLoginMode = this.toLoginMode.bind(this)
    this.toSignupMode = this.toSignupMode.bind(this)
    this.loginMode = this.loginMode.bind(this)
    this.guestMode = this.guestMode.bind(this)
    this.signupMode = this.signupMode.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  signIn(username, password) {
    Axios.get('http://localhost:5000/login/', {params: {user_name: username, password: password}}).then(
      (res) => {
        console.log(res.data)
        // if (res.data.length > 0) this.props.setUser(res.data)
      }
    )
  }

  signUp(first_name, last_name, username, password) {

  }

  signOut() {

  }

  toGuestMode = () => {this.setState({mode: this.guestMode})}
  toLoginMode = () => {this.setState({mode: this.loginMode})}
  toSignupMode = () => {this.setState({mode: this.signupMode})}

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  guestMode = () => {
    return (
      <div>
        <button onClick={this.toLoginMode}>login</button>
        <button onClick={this.toSignupMode}>sign up</button>
      </div>
    )
  }

  loginMode = () => {
    return (
      <div>
        <button onClick={this.toLoginMode}>login</button>
        <button onClick={this.toGuestMode}>back</button>
        <br/>
        <input
          type="text"
          name="username"
          placeholder="user name ..."
          value={ this.state.username }
          onChange={ this.handleChange }
        />
        <input
          type="password"
          name="password"
          placeholder="password ..."
          value={ this.state.password }
          onChange={ this.handleChange }
        />
      </div>
    )
  }

  signupMode = () => {
    return (
      <div>
        <button onClick={this.signUp}>sign up</button>
        <button onClick={this.toGuestMode}>back</button>
        <br/>
        <input
          type="text"
          name="username"
          placeholder="user name ..."
          value={ this.state.username }
          onChange={ this.handleChange }
        />
        <input
          type="password"
          name="password"
          placeholder="password ..."
          value={ this.state.password }
          onChange={ this.handleChange }
        />
        <br/>
        <input
          type="text"
          name="first_name"
          placeholder= {"first name ..."}
          value={ this.state.first_name }
          onChange={ this.handleChange }
        />
        <input
          type="text"
          name="last_name"
          placeholder="last name ..."
          value={ this.state.last_name }
          onChange={ this.handleChange }
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.state.mode()}
      </div>
    )
  }
}

export default Login;
