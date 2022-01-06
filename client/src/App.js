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
      display: <Board/>,
      currentUser: "Guest"
    }
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={() => {this.setState({display: <Comment/>})}}>Comment</button>
          <button onClick={() => {this.setState({display: <Login/>})}}>Login</button>
          <button onClick={() => {this.setState({display: <Board/>})}}>Board</button>
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
        this.setState({data: data});
      }
    )
  }

  render() {
    return (
      <div>
        <Search getDoctors={this.getDoctors}/>
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
    this.invokeSearch = this.invokeSearch.bind(this)
    this.getStates = this.getStates.bind(this);
    this.getStates();
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
        <label>state: </label>
        <Select
          setSelect={(val) => {this.setState({state: val})}}
          suffix='states/'
        />
        <label>city: </label>
        <Select
          setSelect={(val) => {this.setState({city: val})}}
          suffix='city/'
        />
        <label>specialty: </label>
        <Select
          setSelect={(val) => {this.setState({specialty: val})}}
          suffix='specialty/'
        />
        <button onClick={() => {this.invokeSearch()}}>search</button>
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
    this.getOptions();
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
//
// class StateSelect extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       options: [],
//     };
//     this.getOptions = this.getOptions.bind(this);
//     this.getOptions();
//   }
//
//   getOptions() {
//     Axios.get('http://localhost:5000/states/').then(
//       (res) => {
//         this.setState({options: res.data})
//       }
//     )
//   }
//
//   render() {
//     return (
//       <div>
//         <select onChange={(e) => this.props.setSelect(e.target.value)}>
//           {this.state.options.map((option) => <option>{option}</option>)}
//         </select>
//       </div>
//     )
//   }
// }

// class Switch extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       display: <StateSelect/>,
//     }
//     this.searchMode = this.searchMode.bind(this)
//     this.selectMode = this.selectMode.bind(this)
//   }
//
//   searchMode() {
//     this.setState({display: <Search/>})
//   }
//
//   selectMode() {
//     this.setState({display: <StateSelect/>})
//   }
//
//   render() {
//     return (
//       <div>
//         <button onClick={this.searchMode}>search</button>
//         <button onClick={this.selectMode}>select</button>
//         <br/>
//         {this.state.display}
//       </div>
//     )
//   }
// }
