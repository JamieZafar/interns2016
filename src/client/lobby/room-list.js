import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import lobbyStyle from './lobby.scss';
import style from '../common/common.scss';

const ENTER_KEY = 13;

export class RoomList extends Component {
    createRoom() {
        cloakService.messageCreateRoom(this.state.roomname);
    }

    handleRoomname(event) {
        this.setState({
            roomname: event.target.value
        });
    }

    handleEnterPress(event) {
        if(event.which === ENTER_KEY) {
            this.createRoom();
        }
    }

    render() {
        return (
            <div className="col-lg-8 text-center">
                <h2>Rooms</h2>
                 <div className="col-lg-12 text-center">
                    <div className="col-lg-12 list-group">
                        <div className="row">
                            <i className={`fa fa-cog fa-5x ${lobbyStyle['cogs-icon']}`}></i>
                            <input className={lobbyStyle['room-creator-input']} placeholder="Room Name"type="text" 
                            onChange={(event) => this.handleRoomname(event)} onKeyDown={event => this.handleEnterPress(event)}/>
                            <button className={`btn btn-success`} id="room-name-button"
                                onClick={() => this.createRoom()}>Create</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 pre-scrollable list-group">
                    {this.props.roomList.map( room => {
                        if(!room.data.started){
                            return (
                                <button className={`list-group-item list-group-item-${getColour(room)} ${style.space}`} key={room.id}
                                        disabled={room.data.started} onClick={()=>joinRoom(room)}>
                                    {room.name}
                                    <span className='badge'>{room.users.length}</span>
                                </button>
                            );
                        }
                    })}
                </div>
            </div>
        )
    }
}

function getColour(room) {
    if(room.data.started){
        return 'danger';
    }
    else{
        return 'warning';
    }
}

function joinRoom(room) {
    router.navigateToRoom(`${room.id}`);
}


const mapStateToProps = state => ({
    roomList: state.lobby.rooms
});

export default connect(
    mapStateToProps
)(RoomList);

