import React from 'react';
import './App.css';
import Axios from 'axios';
import Login from './Login'

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
      display: <Search/>
    }
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={() => {this.setState({display: <Search/>})}}>search</button>
          <button onClick={() => {this.setState({display: <Login/>})}}>login</button>
          <button onClick={() => {this.setState({display: <Board/>})}}>board</button>
        </div>
        <br/>
        {this.state.display}
      </div>
    )
  }
}

class Span extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spanned: false
    }
    this.switchSpan = this.switchSpan.bind(this)
  }

  base = () => {
    return (
      <p>base</p>
    )
  }

  add = () => {
    return (
      <p>add</p>
    )
  }

  switchSpan = () => {
    this.setState({spanned: !this.state.spanned})
  }

  render() {
    return (
      <div>
        {this.base()}
        <button onClick={this.switchSpan}>{this.state.spanned ? '-' : '+'}</button>
        {this.state.spanned ? this.add() : <div/>}
      </div>
    )
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      data: []
    };
    this.getDoctors = this.getDoctors.bind(this)
  }

  getDoctors = (filters) => {
    Axios.get('http://localhost:5000/search/', {params: filters}).then(
      (response) => {
        const data = response.data;
        console.log(data);
        this.setState({data: data});
      }
    )
  }

  render() {
    return (
      <div>
        <Search getDoctors={this.getDoctors}/>
        {/*<Search getDoctors={'this.getDoctors'}/>*/}
        <table>
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
      states: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.invokeSearch = this.invokeSearch.bind(props)
    this.getStates = this.getStates.bind(this);
    this.getStates();

    console.log(props)
  }

  getStates() {
    console.log('getStates call')
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
    console.log(this.state);
  }

  invokeSearch = () => {
    this.props.getDoctors(this.state)
  }

  render() {
    return (
      <div>
        <label>state: </label>
        <StateSelect
          onChange={
            (val) => {this.setState({state: val})}
          }
        />
        <label>city: </label>
        <input
          type="text"
          name="city"
          placeholder="Enter city ..."
          value={ this.state.city }
          onChange={ this.handleChange }
        />
        <label>specialty: </label>
        <input
          type="text"
          name="specialty"
          placeholder="Enter specialty ..."
          value={ this.state.specialty }
          onChange={ this.handleChange }
        />
        <button onClick={this.invokeSearch}>search</button>
        {this.state.result}
      </div>
    )
  }
}

class StateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
    this.getOptions = this.getOptions.bind(this);
    this.getOptions();
  }

  getOptions() {
    Axios.get('http://localhost:5000/states/').then(
      (res) => {
        this.setState({options: res.data})
      }
    )
  }

  render() {
    return (
      <select>
        {this.state.options.map((option) => <option>{option}</option>)}
      </select>
    )
  }
}

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: <StateSelect/>,
    }
    this.searchMode = this.searchMode.bind(this)
    this.selectMode = this.selectMode.bind(this)
  }

  searchMode() {
    this.setState({display: <Search/>})
  }

  selectMode() {
    this.setState({display: <StateSelect/>})
  }

  render() {
    return (
      <div>
        <button onClick={this.searchMode}>search</button>
        <button onClick={this.selectMode}>select</button>
        <br/>
        {this.state.display}
      </div>
    )
  }
}
