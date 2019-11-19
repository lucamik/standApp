import React, { Component } from 'react';
import { Container } from 'reactstrap';
import ReportItem from "./ReportItem";

class Report extends Component {

    constructor (props) {
        super(props)

        this.state = {
            data: [],
            actions: [],
            readableActions: null
        }

        this.generateReadableReport = this.generateReadableReport.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.generateReadableReport()
        }
    }

    getActionsByCard() {
        let actions = []

        this.state.data.forEach((item) => {
            if (typeof actions[item.data.card.id] === 'undefined')
                actions[item.data.card.id] = []
            actions[item.data.card.id].push(item)
        })

        this.setState({
            actions: actions
        })
    }

    async generateReadableReport() {
        await this.sortActionsByTime()
        await this.getActionsByCard()

        let readableActions = []

        for (let cardId in this.state.actions) {
            readableActions.push(<ReportItem key={cardId} item={this.state.actions[cardId]}/>)
        }

        this.setState({
            readableActions: readableActions
        })
    }

    sortActionsByTime() {
        let sortedData = this.props.data
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date))
        this.setState({
            data: sortedData
        })
    }

    render() {
        return (
            <Container>
                    {
                        this.state.readableActions && this.state.readableActions.length === 0 ?
                            <h4>No activity detected on that day</h4> : this.state.readableActions
                    }
            </Container>
        );
    }
}

export default Report;