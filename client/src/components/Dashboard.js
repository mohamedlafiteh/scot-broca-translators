import React, { Component } from "react";
import moment from "moment";
import { Header, Container, Table, Button, Message } from "semantic-ui-react";
import { getDocuments } from "../api/documents";
import { pickDocument, cancelTranslation } from "../api/translations";
import ActionColumn from "./ActionColumn";
import StatusColumn from "./StatusColumn";
import NameColumn from "./NameColumn";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: []
    };
  }

  componentDidMount() {
    this.setDocuments();
  }

  setDocuments = () => {
    getDocuments()
      .then(documents => {
        this.setState({ documents });
      })
      .catch(err => console.log(err));
  };

  handlePickDocumentClick = id => {
    pickDocument(id)
      .then(response => {
        if (response.status === 200) {
          this.setDocuments();
        } else {
          throw response;
        }
      })
      .catch(error => {
        error.text().then(errorMessage =>
          this.setState({
            hasErrors: true,
            errorMessage: errorMessage
          })
        );
      });
  };
  handleCancelTranslationClick = id => {
    cancelTranslation(id)
      .then(response => {
        if (response.status === 200) {
          this.setDocuments();
        } else {
          throw response;
        }
      })
      .catch(error => {
        error.text().then(errorMessage =>
          this.setState({
            hasErrors: true,
            errorMessage: errorMessage
          })
        );
      });
  };

  render() {
    const { documents } = this.state;
    const userName = sessionStorage.getItem("userName");
    const userRole = sessionStorage.getItem("userRole");

    return (
      <Container>
        <Header as="h2">Hello {userName}!</Header>
        {userRole === "User" ? (
          <Button onClick={() => this.props.history.push("/add-document")}>
            Add document
          </Button>
        ) : null}
        {this.state.hasErrors ? (
          <Message negative>
            <Message.Header>An error occurred</Message.Header>
            <p>{this.state.errorMessage}</p>
          </Message>
        ) : null}
        <Table celled unstackable selectable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Document</Table.HeaderCell>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell>From Language</Table.HeaderCell>
              <Table.HeaderCell>To Language</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {documents &&
              documents.map(document => {
                const {
                  id,
                  name,
                  from_language_name,
                  to_language_name,
                  status,
                  translator_name,
                  translation_id
                } = document;
                const dueDate = moment(document.due_date).format("L");
                const currentDate = new Date();
                const dateOnly = moment(currentDate).format("L");
                const threeDaysLeft = moment(currentDate)
                  .add(3, "days")
                  .format("L");
                const twoDaysLeft = moment(currentDate)
                  .add(2, "days")
                  .format("L");
                const oneDayLeft = moment(currentDate)
                  .add(1, "days")
                  .format("L");
                return (
                  <Table.Row key={id}>
                    <NameColumn
                      name={name}
                      status={status}
                      dueDate={dueDate}
                      currentDate={currentDate}
                      dateOnly={dateOnly}
                      oneDayLeft={oneDayLeft}
                      twoDaysLeft={twoDaysLeft}
                      threeDaysLeft={threeDaysLeft}
                    />
                    <Table.Cell>{dueDate}</Table.Cell>
                    <Table.Cell>{from_language_name}</Table.Cell>
                    <Table.Cell>{to_language_name}</Table.Cell>
                    <StatusColumn
                      status={status}
                      translatorName={translator_name}
                    />
                    <ActionColumn
                      translatorName={translator_name}
                      id={id}
                      status={status}
                      userName={userName}
                      userRole={userRole}
                      translationId={translation_id}
                      handlePickDocumentClick={this.handlePickDocumentClick}
                      handleCancelTranslationClick={
                        this.handleCancelTranslationClick
                      }
                    />
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

export default Dashboard;
