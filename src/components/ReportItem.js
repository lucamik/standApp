import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import './ReportItem.css';

class ReportItem extends Component {

    constructor (props) {
        super(props);

        this.state = {
            item: this.props.item,
            first: this.props.first
        }
    }

    convertToReadable() {
        let first = true;

        return this.state.item.map(action => {
            let readableActions = [];

            switch(action.type) {
                case "updateCard":
                    if (action.data.listBefore && action.data.listAfter) {
                        let decodedAction = this.cardMoveInterpreter(action.data.listBefore.name, action.data.listAfter.name, action.currentList);
                        if (decodedAction) {
                            readableActions.push(decodedAction);
                        }
                    }
                    break;
                default:
            }

            let header = null;
            let nextAction = null;

            if (first) {
                let labelColor = action.labelInfo.colors.filter(colors => !colors.name).map(colors => colors.color)

                nextAction = action.labelInfo.colors.filter(colors =>
                    colors.name !== '' && colors.name !== "Blocked" && colors.name !== "Stuck").map(colors =>
                            <span key={colors.color} className={"p-1 m-1 " + colors.color}><nobr>{colors.name}</nobr></span>)

                header = (
                    <Col>
                        <Row>&nbsp;</Row>
                        <Row>
                            <Col xs={1} className={labelColor + "Label"}><div className="background">&nbsp;</div></Col>
                            <Col md={10} className={"text-left cardTitle " + labelColor + "Title"}>{action.data.card.name} <span className="font-italic font-weight-normal">(Currently: {nextAction && nextAction.length > 0 ? nextAction : action.currentList})</span></Col>
                        </Row>
                    </Col>
                )
            }

            first = false;

            return (
                <Col key={action.id}>
                    {header}
                    {readableActions.map(readableAction => <Row key="readableAction"><Col xs={2}>&nbsp;</Col><Col md={10} className='text-left'>{readableAction}</Col></Row>)}
                </Col>
            )
        })
    }

    cardMoveInterpreter(before, after, current) {
        if (before === 'Now Available' && after === 'In Dev') {
            return 'Started working on this card'
        }
        if (before === 'Now Available' && after === 'In Review') {
            return current !== after ? 'Reviewed' : 'Started reviewing'
        }
        if (before === 'Now Available' && after === 'In QA') {
            return current !== after ? 'Did QA' : 'Started doing QA'
        }
        if (before === 'Now Available' && after === 'In Acceptance') {
            return current !== after ? 'Did UAT' : 'Started doing UAT'
        }
        if (before === 'Now Available' && after === 'In Deployment') {
            return current !== after ? 'Deployed to Production' : 'Started deploying to Production'
        }

        return null
    }

    render() {
        return (
            <Col>{this.convertToReadable()}</Col>
        )
    }
}

export default ReportItem;