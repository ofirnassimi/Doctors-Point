import React from "react";
import Axios from "axios";

class Login extends React.Component {
  // guest = {id: 0, first_name: 'dear', last_name: 'guest'};

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
    this.todeleteUserMode = this.todeleteUserMode.bind(this)

    this.loginMode = this.loginMode.bind(this)
    this.guestMode = this.guestMode.bind(this)
    this.signupMode = this.signupMode.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleLoginResponse(res) {
    if (res.status === 200) {
      console.log(res.data);
      this.props.setUser(res.data)
    } else {
      this.setState({msg: 'login failed'})
    }
  }

  signIn(username, password, delUser=false) {
    const params = {user_name: username, password: password}
    Axios.get('http://localhost:5000/login/', {params: params}).then(
      (res) => {this.handleLoginResponse(res)}
    )
  }
        // // if (res.data.length > 0) this.props.setUser(res.data) TODO: verify known user
        //   if(delUser){
        //       Axios.delete('http://localhost:5000/login/', {params: {user_name: username}})
        //   }

  signUp(first_name, last_name, username, password) {
    const data = {user_name: username, password: password,
                  first_name: first_name, last_name: last_name}
    Axios.post('http://localhost:5000/login/', data).then(
      (res) => {this.handleLoginResponse(res)}
    )
  }

  signOut() {

  }

  toGuestMode = () => {this.setState({mode: this.guestMode})}
  toLoginMode = () => {this.setState({mode: this.loginMode})}
  toSignupMode = () => {this.setState({mode: this.signupMode})}
  todeleteUserMode = () => {this.setState({mode: this.deleteUserMode})}


  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  guestMode = () => {
    return (
      <div>
        <button onClick={this.toLoginMode}>Login</button>
        <button onClick={this.toSignupMode}>Sign Up</button>
          <button onClick={this.todeleteUserMode}>Delete User</button>

      </div>
    )
  }

  loginMode = () => {
    return (
      <div>
        <button onClick={()=>this.signIn(this.state.username,
            this.state.password)}>login</button>
        <button onClick={this.toGuestMode}>back</button>
        <br/>
        <input
          type="text"
          name="username"
          placeholder="user name ..."
          // value={ this.state.username }
          onChange={ this.handleChange }
        />
        <input
          type="password"
          name="password"
          placeholder="password ..."
          // value={ this.state.password }
          onChange={ this.handleChange }
        />
      </div>
    )
  }

  deleteUserMode = () => {
    return (
      <div>
        <button onClick={()=>this.signIn(this.state.username,
            this.state.password, true)}>Delete user</button>
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
        <button onClick={()=>this.signUp(this.state.first_name,
            this.state.last_name, this.state.username, this.state.password)}>sign up</button>
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
