import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';

import config from '../config/config';

import style from './lobby.scss';

export default function RoomList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>Rooms Available</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                {props.roomList.map( result => {
                    return (
                        <button className={`list-group-item list-group-item-warning ${style.space}`} key={result.id}
                             onClick={()=>joinRoom({id: result.id, name: result.name})}>
                             {result.name}
                            <span className='badge'>{result.users.length}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function joinRoom(arg) {
    cloak.message('joinRoom', arg.id);
    redirectToRoom(arg.name);
}

function redirectToRoom(arg) {
    browserHistory.push(`/room/${arg}`);
}
