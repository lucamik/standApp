import React, { Component } from 'react';
import './App.css';
import { Form, FormGroup, Label, Input, Row, Col, Button, Alert } from "reactstrap";
import Calendar from "react-calendar";
import cookie from 'react-cookies';
import Autocomplete from 'react-autocomplete';
import LoadingScreen from './components/LoadingScreen';
import Report from './components/Report';

import {getActionsByBoardId, getBoards, getMemberInfo} from "./classes/Trello";


class App extends Component {

    constructor (props) {
        super(props);

        this.state = {
            apiKey: cookie.load('apiKey'),
            token: cookie.load('token'),
            devTeam: cookie.load('devTeam'),
            boardId: cookie.load('boardId'),
            boards: [],
            idMember: '',
            fullName: '',
            date: new Date(),
            data: [],
            errors: [],
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.generateStandUp = this.generateStandUp.bind(this);
    }

    componentDidMount() {
        this.getBoardOptions()
    }

    async getBoardOptions() {
        if (this.state.apiKey && this.state.token && this.state.devTeam) {
            let boards = await getBoards(this.state.apiKey, this.state.token, this.state.devTeam)
            this.setState({
                boards: boards
            })
        }
    }

    handleChange(event, name = null, value = null) {
        if (!name) {
            name = event.target.name
        }
        if (!value) {
            value = event.target.value
        }
        this.setState({[name]: value}, () => {
            this.getBoardOptions()
        })
        cookie.save(name, value, { path: '/' })
    }

    handleChangeDate = date => this.setState({ date })

    async generateStandUp() {
        this.setState({
            loading: true
        })

        let errorsTmp = []

        if (!this.state.apiKey) {
            errorsTmp.push('ApiKey is required')
        }
        if (!this.state.token) {
            errorsTmp.push('Token is required')
        }
        if (!this.state.devTeam) {
            errorsTmp.push('Team is required')
        }
        if (!this.state.boardId === "") {
            errorsTmp.push('Board is required')
        }

        this.setState({
            errors: errorsTmp,
            loading: false
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

                    if (result.data && !result.error) {
                        this.setState({
                            data: result.data,
                            loading: false
                        })
                    }

                    if (result.error) {
                        this.setState({
                            data: [],
                            errors: [result.error],
                            loading: false
                        })
                    }
                })
            }

            if (memberInfo.error) {
                this.setState({
                    errors: [memberInfo.error],
                    data: [],
                    loading: false
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
                    <div className="errorMsg">
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
                        <Label for="devTeam">Team</Label>
                        <Autocomplete
                            getItemValue={(item) => item.label}
                            items={[
                                { label: 'Chameleon' },
                                { label: 'Codebusters' },
                                { label: 'Scrumdiddy' }
                            ]}
                            renderItem={(item, isHighlighted) =>
                                <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.label}
                                </div>
                            }
                            shouldItemRender={(item, value) =>
                                (item.label.toLowerCase().indexOf(value.toLowerCase()) === 0 && value.length > 0) ? item.label : ''
                            }
                            inputProps={{className:"form-control", id:"devTeam", name:"devTeam", placeholder:"Enter Your Team"}}
                            wrapperProps={{className:"form-group"}}
                            wrapperStyle={{display: "block"}}
                            value={this.state.devTeam}
                            onChange={(event) => this.handleChange(event)}
                            onSelect={(val) => this.handleChange(null, 'devTeam', val)}
                        />
                        <FormGroup>
                            <Label for="token">Board</Label>
                            <Input
                                type="select"
                                name="boardId"
                                id="boardId"
                                value={this.state.boardId}
                                onChange={this.handleChange}
                                disabled={(this.state.boards.length > 0) ? '' : 'disabled'}
                            >
                                <option value="">Select a Board</option>
                                {this.state.boards.map((board) => {
                                    return <option key={board.id} value={board.id}>{board.name}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="calendar">StandUp Day</Label>
                            <Calendar
                                name="calendar"
                                onChange={this.handleChangeDate}
                                value={this.state.date}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={() => this.generateStandUp()}>Generate Stand Up</Button>
                        </FormGroup>
                    </Form>
                </Col>
                </Row>
                <br/><br/>
                <Row className="justify-content-center">
                    {this.state.loading ? <LoadingScreen/> : <Report data={this.state.data} />}
                </Row>
            </div>
        );
    }
}

export default App;
