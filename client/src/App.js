import React from 'react';
import './App.css';
import Axios from 'axios';

function App() {
  return (
    <div className="App">
      <h1>Doctors and Clinics App</h1>
      {/*<Login/>*/}
      <Board/>
    </div>
  );
}

export default App;

// class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: {id: 0, first_name: 'dear', last_name: 'guest'}
//     };
//     // this.operations = sign
//   }
//
//   signUp() {
//
//   }
//
//   render() {
//     const name = this.state.user.first_name + " " + this.state.user.last_name;
//     var buttons;
//     if (this.state.user.id === 0) {
//       buttons = (<button onClick={this.signUp}>sign up</button>)
//     } else {
//       buttons = (
//         <div>
//           <button>sign out</button>
//           <button>delete user</button>
//         </div>
//       )
//     }
//     return (
//       <div>
//         hi {name}
//         <br/>
//         {buttons}
//       </div>
//     )
//   }
// }
//
// class SignUp extends React.Component {
//
// }

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.get_doctors = this.get_doctors.bind(this)
  }

  get_doctors() {
    Axios.get('http://localhost:5000/search/').then(
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
        <button onClick={this.get_doctors}>search</button>
        <table>
          {this.state.data.map((doctor) => <tr>{doctor.map((item) => <td>{item}</td>)}</tr>)}
        </table>
      </div>
    )
  }
}


// function Line(props) {
//   return (
//     <button className="square" onClick={() => props.onClick()}>
//       {props.data}
//     </button>
//   );
// }


// class Doctors extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // squares: Array(20).fill(null),
//       lines: Axios.get('http://localhost:5000/doctors/'),
//     };
//   }
//
//   // handleClick(i) {
//   //   const lines = this.state.lines.slice();
//   //   lines[i] = i;
//   //   this.setState({
//   //     lines: lines,
//   //     xIsNext: !this.state.xIsNext,
//   //   });
//   // }
//
//   renderLine(i) {
//     return (<Line
//       value={this.state.lines[i]}
//       // onClick={() => this.handleClick(i)}
//     />);
//   }
//
//   render() {
//     const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//
//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }
