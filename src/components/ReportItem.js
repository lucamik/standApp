import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import './ReportItem.css';

class ReportItem extends Component {

    constructor (props) {
        super(props)

        this.state = {
            item: this.props.item
        }
    }

    convertToReadable() {
        return this.state.item.map(action => {
            let labels = action.labelInfo.colors.map(colors =>
                <Col key={colors.color} xs={1} className={"label " + colors.color}>&nbsp;</Col>
            )

            let readableActions = []

            switch(action.type) {
                case "updateCard":
                    if (action.data.listBefore && action.data.listAfter) {
                        readableActions.push(this.cardMoveInterpreter(action.data.listBefore.name, action.data.listAfter.name))
                    }
                    break
                default:
            }
            return (
                <Col key={action.id}>
                    <Row>
                        <Col xs={1}><Row>{labels}</Row></Col><Col md={10} className='text-left cardTitle'>{action.data.card.name}</Col>
                    </Row>
                    {readableActions.map(readableAction => <Row key="readableAction"><Col xs={1}>&nbsp;</Col><Col md={10} className='text-left'>{readableAction}</Col></Row>)}
                </Col>
            )
        })
    }

    cardMoveInterpreter(before, after) {
        if (before === 'Needs Changes' && after === 'In Progress') {
            return 'Started working on fixes after review'
        }
        if (before === 'In Progress' && after === 'Needs Review') {
            return 'Worked on this card and got it ready for review'
        }
        if (before === 'In Progress' && after === 'Needs QA') {
            return 'Worked on this card and it is now ready for QA'
        }
        //add all possible combinations
    }

    render() {
        return (
            <Col>{this.convertToReadable()}</Col>
        )
    }
}

export default ReportItem;