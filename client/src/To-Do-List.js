import React, { Component } from "react";
import axios from "axios";
import { Button, Card, Header, Form, Input, Icon } from "semantic-ui-react";

let endpoint = "http://your_backend_server_host:8080";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      deadline: "",
      items: []
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = () => {
    let { task } = this.state;
    let { deadline } = this.state;
    // console.log("pRINTING task", this.state.task);
    if (task) {
      axios
        .post(
          endpoint + "/api/task",
          {
            task,
            deadline
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          this.getTask();
          this.setState({
            task: ""
          });
          console.log(res);
        });
    }
  };

  getTask = () => {
    axios.get(endpoint + "/api/task").then(res => {
      console.log(res);
      if (res.data) {
        this.setState({
          items: res.data.map(item => {
            let color = "yellow";

            if (item.status) {
              color = "green";
            }
            return (
              <Card key={item._id} style={{backgroundColor: color}} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word"}}>Task Name: {item.task}</div>
                    <div style={{ wordWrap: "break-word"}}>Deadline: {item.deadline}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Button
                      onClick={() => this.updateTask(item._id)}
                    > Done </Button>
                    <Button
                      onClick={() => this.undoTask(item._id)}
                    > Undo </Button>
                    <Button
                      onClick={() => this.deleteTask(item._id)}
                    > Delete </Button>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })
        });
      } else {
        this.setState({
          items: []
        });
      }
    });
  };

  updateTask = id => {
    axios
      .put(endpoint + "/api/task/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  undoTask = id => {
    axios
      .put(endpoint + "/api/undoTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  deleteTask = id => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };
  render() {
    return (
      <div>
        <div className="row">
          <Header className="header" as="h2">
            TO DO LIST [CLOUD HW5]
          </Header>
        </div>
        <div className="row">
          <Form onSubmit={this.onSubmit}>
            <Input
              type="text"
              name="task"
              onChange={this.onChange}
              value={this.state.task}
              placeholder="Task"
            />
            <Input
              type="text"
              name="deadline"
              onChange={this.onChange}
              value={this.state.deadline}
              placeholder="Deadline"
            />
          <Button animated type="submit">
            <Button.Content visible>
              Create Task
            </Button.Content>
            <Button.Content hidden type="submit">
              <Icon name='plus square' />
            </Button.Content>
          </Button>
          </Form>
        </div>
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
      </div>
    );
  }
}

export default ToDoList;
