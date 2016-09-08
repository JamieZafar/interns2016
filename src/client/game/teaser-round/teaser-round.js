import React, { Component } from 'react';
import { connect } from 'react-redux';

export class TeaserRound extends Component {
    render() {
        return(
            <div>
                TEASE MEH
            </div>
        );
    }
}

const mapStateToProps = state => ({
    teaserAnagram: state.game.teaserAnagram
});

export default connect(
    mapStateToProps
)(TeaserRound)