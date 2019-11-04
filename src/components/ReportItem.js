import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import './ReportItem.css';

class ReportItem extends Component {

    constructor (props) {
        super(props)

        this.state = {
            item: this.props.item,
            first: this.props.first
        }
    }

    convertToReadable() {
        let first = true

        return this.state.item.map(action => {
            let readableActions = []

            switch(action.type) {
                case "updateCard":
                    if (action.data.listBefore && action.data.listAfter) {
                        readableActions.push(this.cardMoveInterpreter(action.data.listBefore.name, action.data.listAfter.name))
                    }
                    break
                default:
            }

            let header = null

            if (first) {
                let labels = action.labelInfo.colors.map(colors =>
                    <Col key={colors.color} xs={1} className={"label " + colors.color}>&nbsp;</Col>
                )

                header = (
                    <Col>
                        <Row>&nbsp;</Row>
                        <Row>
                            <Col xs={1}><Row>{labels}</Row></Col>
                            <Col md={10} className='text-left cardTitle'>{action.data.card.name}</Col>
                        </Row>
                    </Col>
                )
            }

            first = false

            return (
                <Col key={action.id}>
                    {header}
                    {readableActions.map(readableAction => <Row key="readableAction"><Col xs={1}>&nbsp;</Col><Col md={10} className='text-left'>{readableAction}</Col></Row>)}
                </Col>
            )
        })
    }

    cardMoveInterpreter(before, after) {
        if (before === 'Not Started' && after === 'In Progress') {
            return 'Started working on this card'
        }
        if ((before === 'Needs Changes' && after === 'In Progress') || (before === 'Needs Review' && after === 'In Progress')) {
            return 'Started working on fixes after changes were requested'
        }
        if (before === 'Needs Changes' && after === 'Needs QA') {
            return 'Moved card to Needs QA after review'
        }
        if (before === 'In Progress' && after === 'Needs Review') {
            return 'Got it ready for review'
        }
        if (before === 'In Progress' && after === 'Needs QA') {
            return 'Got it ready for QA'
        }
        if (before === 'Needs Review' && after === 'In Review') {
            return 'Started reviewing this card'
        }
        if (before === 'In Review' && after === 'Done') {
            return 'Moved card to Done after review'
        }
        if (before === 'In Review' && after === 'Needs QA') {
            return 'Moved card to Needs QA after review'
        }
        if (before === 'In Review' && after === 'Needs Changes') {
            return 'Moved card to Needs Changes after review'
        }
        if (before === 'Needs QA' && after === 'In QA') {
            return 'Started doing QA on this card'
        }
        if (before === 'In QA' && after === 'QA Complete') {
            return 'QA completed successfully'
        }
        if (before === 'Needs Review' && after === 'Done') {
            return 'Reviewed and moved to Done. No need for QA and UAT'
        }
        return 'Not readable case for this scenario: From ' + before + ' To ' + after
    }

    render() {
        return (
            <Col>{this.convertToReadable()}</Col>
        )
    }
}

export default ReportItem;