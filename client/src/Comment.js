import React from "react";
import Axios from "axios";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            docId: 0,
            rate: 0
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
              <label>docID</label>
              <input
                type="text"
                name="docId"
                placeholder="Enter Doctors ID"
                // value={ this.state.docId }
                onChange={ this.handleChange }
              />
                <label>Feedback</label>
              <input
                type="text"
                name="feedback"
                placeholder="Enter Feedback"
                // value={ this.state.docId }
                onChange={ this.handleChange }
              />
                <select onChange={(event)=>{this.setState({rate: event.target.value})}}>
                    <option>1 (Poor)</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5 (Excellent)</option>
                </select>
                <button onClick={()=>this.addComment(
                    this.state.docId,
                    this.state.comment,
                    this.state.rate)}>Submit Comment</button>

            </div>
        )
    }
}
