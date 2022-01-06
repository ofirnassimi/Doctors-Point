import React from "react";
import Axios from "axios";

export default class Comment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        columns: [],
        comments: [],
        docId: 0,
        rate: 0,
        feedback: ''
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
        Axios.get('http://localhost:5000/get_comments/', {params: {doctor_id: docID}}).then(
      (response) => {
        const data = response.data;
        this.setState({comments: data[0], columns: data[1]});
        })
    }

    addComment(docID, comment, rate){
        Axios.post('http://localhost:5000/send_comment/', {doctor_id: docID, text: comment, rating: rate})
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
              /><br/><br/>
                <label>Feedback</label>
              <input
                type="text"
                name="feedback"
                placeholder="Enter Feedback"
                // value={ this.state.docId }
                onChange={ this.handleChange }
              /><br/><br/><label>Rate (1-lowest, 5-highest)</label>
                <select onChange={(event)=>{this.setState({rate: event.target.value})}}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <br/><br/>
                <button onClick={()=>this.addComment(
                    this.state.docId,
                    this.state.feedback,
                    this.state.rate)}>Submit Comment</button>
                <br/>
                <br/>
                <br/><br/>
                <label>Read feedbacks on specific Dr. by filling Dr's ID above</label><br/>
<br/>
                <button onClick={()=>this.getComment(this.state.docId)}>Get Comment by ID</button>

                <table>
          {this.state.columns.map((col) => <th>{col}</th>)}
          {this.state.comments.map((com) => <tr>{com.map((item) => <td>{item}</td>)}</tr>)}
        </table>
            </div>
        )
    }
}
