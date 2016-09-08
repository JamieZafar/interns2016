import React, { Component } from 'react';
import { connect } from 'react-redux';

import storageService from '../../services/storage-service';
import cloakService from '../../services/cloak-service';

export class TeaserRound extends Component {
    componentWillMount() {
        this.setState({
            clue: '',
            submittedClue: false
        });
    }

    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }

    submitClue() {
        cloakService.messageClue(this.state.clue);
        this.setState({
            submittedClue: true
        });
    }

    handleChange(event) {
        this.setState({
            clue: event.target.value
        });
    }

    render() {
        const submitClueButton = (
            <div>
                <button className="btn btn-success" onClick={() => this.submitClue()}>Ready</button>
            </div>
        )
        
        return(
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <div>
                    <p>Leader: {this.props.leader.name}</p>
                    {this.isLeader() ? 
                        <div className="col-lg-12 text-center">
                            {this.props.teaserSolution}
                            <div>
                                <input placeholder="Enter answer here yo" onChange={event => this.handleChange(event)} />
                            </div>
                            {!this.state.submittedClue ? 
                                <div>
                                    {submitClueButton}
                                </div>
                            : null}
                        </div>
                    : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    leader: state.game.leader,
    teaserAnagram: state.game.teaserAnagram,
    teaserSolution: state.game.teaserSolution
});

export default connect(
    mapStateToProps
)(TeaserRound)