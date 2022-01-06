import React from 'react';
import './App.css';
import Axios from 'axios';
import Login from './Login'
import Comment from './Comment'


function App() {
  return (
    <div className="App">
      <h1>Doctors and Clinics App</h1>
      <Display/>
    </div>
  );
}

export default App;

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: (<h3>Welcome to Doctors' Point App!</h3>),
      currentUser: "Guest",
        logged: false
    }
  }



  login = (
      <button onClick={() => {this.setState({display:
          <Login setUser={(name) => {
        this.setState({currentUser:name, logged : true}); console.log('display '+this.state)
    }}/>
  })}}>Login</button>)

    logout = <button onClick={()=>{
        this.setState({currentUser: "Guest", logged: false})
    }}>LogOut</button>

  render() {
    return (
      <div>
        <div>
          <p>Connected as {this.state.currentUser}</p>
          <button onClick={() => {this.setState({display: <Comment/>})}}>Comments</button>
          <button onClick={() => {this.setState({display: <Board/>})}}>Search</button>
            {this.state.logged ? this.logout : this.login}
        </div>
        <br/>
        {this.state.display}
      </div>
    )
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      columns: [],
      data: []
    };
    this.getDoctors = this.getDoctors.bind(this)
    this.getTop10();
  }

  getDoctors = (filters) => {
    Axios.get('http://localhost:5000/search/', {params: filters}).then(
      (res) => {
        this.setState({data: res.data[0], columns: res.data[1]});
      }
    )
  }

  getTop10 = () => {
    Axios.get('http://localhost:5000/top10/').then((res) => {
        this.setState({data: res.data[0], columns: res.data[1]})
      })
  }

  render() {
    return (
      <div>
        <Search getDoctors={this.getDoctors} getTop10={this.getTop10}/>
        <br/>
        <table>
          {this.state.columns.map((column) => <th>{column}</th>)}
          {this.state.data.map((doctor) => <tr>{doctor.map((item) => <td>{item}</td>)}</tr>)}
        </table>
      </div>
    )
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
      city: null,
      specialty: null,
      result: null,
      states: [],
      cities: [],
      specialties: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.invokeSearch = this.invokeSearch.bind(this)
    this.getStates = this.getStates.bind(this);
    this.getSpecialties();
    this.getCities();
    this.getStates();
  }

  getCities() {
    Axios.get('http://localhost:5000/city/').then(
      (res) => {
        this.setState({cities: res.data})
      }
    )
  }

  getSpecialties() {
    Axios.get('http://localhost:5000/specialty/').then(
      (res) => {
        this.setState({specialties: res.data})
      }
    )
  }

  getStates() {
    Axios.get('http://localhost:5000/states/').then(
      (res) => {
        this.setState({states: res.data})
      }
    )
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  invokeSearch = () => {
    const filters = {
      state: this.state.state,
      city: this.state.city,
      specialty: this.state.specialty,
    }
    console.log(filters)
    this.props.getDoctors(filters)
  }

  render() {
    return (
      <div>
        <label>State: </label>
        <input
          type="text"
          name="state"
          placeholder="Enter state ..."
          value={ this.state.state }
          onChange={ this.handleChange }
        />
        {/*<Select*/}
        {/*  setSelect={(val) => {this.setState({state: val})}}*/}
        {/*  options={this.state.states}*/}
        {/*/>*/}
        <br/><br/>
        <label>City: </label>
        <input
          type="text"
          name="city"
          placeholder="Enter city ..."
          value={ this.state.city }
          onChange={ this.handleChange }
        />
        {/*<Select*/}
        {/*  setSelect={(val) => {this.setState({city: val})}}*/}
        {/*  options={this.state.cities}*/}
        {/*/>*/}
        <br/><br/>
        <label>Specialty: </label>
        <input
          type="text"
          name="specialty"
          placeholder="Enter specialty ..."
          value={ this.state.specialty }
          onChange={ this.handleChange }
        />
        {/*<Select*/}
        {/*  setSelect={(val) => {this.setState({specialty: val})}}*/}
        {/*  options={this.state.specialties}*/}
        {/*/>*/}
        <br/><br/>
        <button onClick={() => {this.invokeSearch()}}>Search</button>
        <button onClick={() => {this.props.getTop10()}}>TOP 10</button><br/>
        {this.state.result}
      </div>
    )
  }
}

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
    this.getOptions = this.getOptions.bind(this);
    // this.getOptions();
  }

  getOptions() {
    Axios.get('http://localhost:5000/'+this.props.suffix).then(
      (res) => {
        this.setState({options: res.data})
      }
    )
  }

  render() {
    return (
      <div>
        <select onChange={(e) => this.props.setSelect(e.target.value)}>
          {this.state.options.map((option) => <option>{option}</option>)}
        </select>
      </div>
    )
  }
}
