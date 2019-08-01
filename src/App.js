import React, { Component } from 'react';
import './App.css';
import { Form, FormGroup, Label, Input, Row, Col, Button, Alert } from "reactstrap";
import Calendar from "react-calendar";
import cookie from 'react-cookies';

import {getActionsByBoardId, getMemberInfo} from "./classes/Trello";


class App extends Component {

    constructor (props) {
        super(props);

        this.state = {
            apiKey: cookie.load('apiKey'),
            token: cookie.load('token'),
            boardId: cookie.load('boardId'),
            idMember: '',
            fullName: '',
            date: new Date(),
            data: [],
            errors: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.generateStandUp = this.generateStandUp.bind(this);
    }


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        cookie.save(event.target.name, event.target.value, { path: '/' })
    }

    handleChangeDate = date => this.setState({ date })

    async generateStandUp() {
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

        this.setState({
            errors: errorsTmp
        })


        if (errorsTmp.length === 0) {
            let memberInfo = await getMemberInfo(this.state.apiKey, this.state.token)

            if (memberInfo.memberId && memberInfo.memberFullName && !memberInfo.error) {
                this.setState({
                    idMember: memberInfo.memberId,
                    fullName: memberInfo.memberFullName
                }, async () => {
                    let result = await getActionsByBoardId(
                        this.state.apiKey,
                        this.state.token,
                        this.state.boardId,
                        this.state.idMember,
                        this.state.date
                    )

                    if (result.data && ! result.error) {
                        this.setState({data: result.data})
                    }

                    if (result.error) {
                        this.setState({
                            data: [],
                            errors: [result.error]
                        })
                    }
                })
            }

            if (memberInfo.error) {
                this.setState({
                    errors: [memberInfo.error],
                    data: []
                })
            }
        }
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
                    {(this.state.data.length > 0 && this.state.errors.length === 0) ?
                        <div><div>Keep it up {this.state.fullName}!</div>
                        <div><pre>{JSON.stringify(this.state.data, null, 2) }</pre></div></div> :
                        (this.state.fullName && this.state.errors.length === 0) ? <div>You have been lazy {this.state.fullName}!</div> : null}
                </Row>
            </div>
        );
    }
}

export default App;
