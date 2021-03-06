import { UPDATE_ROOM_USERS, GET_ROOM_DATA } from './room-actions';
import { updateState } from '../utils/util';

const initialState = {
	users: [],
	room: {
        data: {
            creator: {}
        }
    },
	username: '',
	roomname: ''
};

const room = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ROOM_USERS:
        	return updateState(state, {
        		users: action.payload
        	});
        case GET_ROOM_DATA:
            return updateState(state, {
            	room: action.payload
            });
        default:
            return state;
    }
};

export default room;
