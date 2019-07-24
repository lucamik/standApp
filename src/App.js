import React, { Component } from 'react';
import './App.css';
import { Form, FormGroup, Label, Input, Row, Col, Button, Alert } from "reactstrap";
import Calendar from "react-calendar";
import cookie from 'react-cookies';


class App extends Component {

    constructor (props) {
        super(props);

        this.state = {
            apiKey: cookie.load('apiKey'),
            token: cookie.load('token'),
            boardId: cookie.load('boardId'),
            username: cookie.load('username'),
            idMember: '',
            fullName: '',
            date: new Date(),
            data: [],
            errors: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.generateStandUp = this.generateStandUp.bind(this);
        this.filterResults = this.filterResults.bind(this);
    }


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        cookie.save(event.target.name, event.target.value, { path: '/' })
    }

    handleChangeDate = date => this.setState({ date })

    generateStandUp() {
        let errorsTmp = []

        if (!this.state.apiKey) {
            errorsTmp.push('ApiKey is required')
        }
        if (!this.state.token) {
            errorsTmp.push('Token is required')
        }
        if (!this.state.boardId) {
            errorsTmp.push('BoardId is required')
        }
        if (!this.state.username) {
            errorsTmp.push('Username is required')
        }

        this.setState({
            errors: errorsTmp
        })


        if (errorsTmp.length === 0) {
            fetch('https://api.trello.com/1/members/' + this.state.username)
                .then(response => response.json())
                .then(
                    (data) => {
                        this.setState({
                            idMember: data.id,
                            fullName: data.fullName
                        }, () => {
                            fetch('https://api.trello.com/1/boards/' + this.state.boardId +
                                '/actions?key=' + this.state.apiKey + '&token=' + this.state.token)
                                .then(response => {
                                    if (response.status !== 200) {
                                        throw new Error(response.status)
                                    }
                                    return response.json()
                                })
                                .then(data => {
                                    let filteredData = this.filterResults(data)
                                    this.setState({data: filteredData})
                                }, (error) => {
                                    let errorMsg
                                    let errorCode = error.toString().match(/\d+/).map(Number)[0]

                                    switch (errorCode) {
                                        case 400:
                                            errorMsg = 'Invalid Board Id'
                                            break
                                        case 401:
                                            errorMsg = 'Wrong credentials. Access denied'
                                            break
                                        default:
                                            errorMsg = 'Unknown error'
                                    }

                                    this.setState({
                                        errors: [errorMsg]
                                    })
                                });
                        })
                    },
                    (error) => {
                        this.setState({
                            errors: ['Username does not exist']
                        })
                    }
                );
        }
    }

    filterResults(data) {
        let filteredData = data.filter((item) => {
            let convDate = new Date(new Date(item.date).toLocaleString("en-US"));
                return item.idMemberCreator === this.state.idMember &&
                convDate.getDate() === this.state.date.getDate() &&
                convDate.getMonth() === this.state.date.getMonth() &&
                convDate.getFullYear() === this.state.date.getFullYear()
        });

        return filteredData
    }

    render() {
        const errorMsgs = this.state.errors.map((msg, id) => {
            return (<Alert key={id} color="danger">{msg}</Alert>)
        })

        return (
            <div className="App">
                <header className="App-header">
                    StandApp
                </header>
                <br/><br/>
                <Row className="justify-content-center">
                <Col sm="4">
                    <div>
                        {errorMsgs}
                    </div>
                    <Form>
                        <FormGroup>
                            <Label for="apiKey">API Key</Label>
                            <Input type="textfield" name="apiKey" id="apiKey" placeholder="Enter your API Key" value={this.state.apiKey} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="token">Token</Label>
                            <Input type="password" name="token" id="token" placeholder="Enter your Token" value={this.state.token} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="token">Board ID</Label>
                            <Input type="textfield" name="boardId" id="boardId" placeholder="Enter Board ID" value={this.state.boardId} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="textfield" name="username" id="username" placeholder="Enter Username" value={this.state.username} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="calendar">StandUp Day</Label>
                            <Calendar
                                name="calendar"
                                onChange={this.handleChangeDate}
                                value={this.state.date}
                            />
                        </FormGroup>
                        <Button onClick={() => this.generateStandUp()}>Generate Stand Up</Button>
                    </Form>
                </Col>
                </Row>
                <br/><br/>
                <Row className="justify-content-center">
                    {(this.state.data.length > 0) ? <div><div>Keep it up {this.state.fullName}!</div>
                    <div><pre>{JSON.stringify(this.state.data, null, 2) }</pre></div></div> : (this.state.fullName) ? <div>You have been lazy {this.state.fullName}!</div> : null}
                </Row>
            </div>
        );
    }
}

export default App;
