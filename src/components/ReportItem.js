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
                let labels = action.labelInfo.colors.map(colors => {
                    return (!colors.name) ?
                        <Col key={colors.color} xs={1} className={"label " + colors.color}>&nbsp;</Col> : null
                })

                nextAction = action.labelInfo.colors.map(colors => {
                        return (colors.name && colors.name !== "Blocked") ?
                            <span key={colors.color} className={"label " + colors.color}><nobr>{colors.name}</nobr></span> : null

                })

                header = (
                    <Col>
                        <Row>&nbsp;</Row>
                        <Row>
                            <Col xs={1}><Row>{labels}</Row></Col>
                            <Col md={10} className='text-left cardTitle'>{action.data.card.name} (Currently: {nextAction.length > 0 ? nextAction : action.currentList})</Col>
                        </Row>
                    </Col>
                )
            }

            first = false;

            return (
                <Col key={action.id}>
                    {header}
                    {readableActions.map(readableAction => <Row key="readableAction"><Col xs={1}>&nbsp;</Col><Col md={10} className='text-left'>{readableAction}</Col></Row>)}
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