import React from "react";
import Axios from "axios";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            docId: 0,
            rate: 0,
            mode: "wellcome"
        }

        this.handleChange = this.handleChange.bind(this)

    }

    handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
    // console.log(this.state);
  }

    getComment(docID){
        Axios.get('http://localhost:5000/comments/?docId='+docID).then(
      (response) => {
        const data = response.data;
        this.setState({comments: data});
        })
    }

    addComment(docID, comment, rate){
        Axios.post('http://localhost:5000/comments/', {docId:docID, text: comment, rate: rate})
    }

    render() {
        return(
            <div>
                <p>Help us improve <br/>by adding a feedback about your Doctor</p>
              <label>Doctor's ID</label>
              <input
                type="text"
                name="docId"
                placeholder="Enter Doctors ID"
                // value={ this.state.docId }
                onChange={ this.handleChange }
              /><br/>
                <label>Feedback</label>
              <input
                type="text"
                name="feedback"
                placeholder="Enter Feedback"
                // value={ this.state.docId }
                onChange={ this.handleChange }
              /><br/><label>Rate (1-lowest, 5-highest)</label>
                <select onChange={(event)=>{this.setState({rate: event.target.value})}}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <br/>
                <button onClick={()=>this.addComment(
                    this.state.docId,
                    this.state.comment,
                    this.state.rate)}>Submit Comment</button>
                <button onClick={()=>this.getComment(this.state.docId)}>Get Comment by ID</button>

                <table>
          {this.state.comments.map((com) => <tr>{com.map((item) => <td>{item}</td>)}</tr>)}
        </table>
            </div>
        )
    }
}
