import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  Header,
  Segment,
  Container,
  Button,
  Form,
  Message
} from "semantic-ui-react";
import { getDocuments } from "../api/documents";
export class CancelTranslation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: []
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;

    getDocuments()
      .then(documents => {
        console.log(documents);
        return this.setState({ documents });
      })
      .catch(err => console.log(err));

    fetch(`/api/translations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        return res.json({
          data: "some thing is wrong MOhamed"
        });
      })
      .then(
        this.setState({
          documents: this.state.documents.filter(
            documents => documents.id !== id
          )
        })
      )
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { id } = this.props.id;
    return (
      <div>
        <span>
          <Link to={`/document/${id}`}>/ Cancel</Link>
        </span>
      </div>
    );
  }
}

export default CancelTranslation;
