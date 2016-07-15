import config from '../config/config';
import storageService from '../services/storage-service';

export {
    configureAndRun,
    messageSetUsername,
    messageCreateRoom,
    messageJoinRoom,
    messageLeaveRoom,
    getRoomData,
    isConnected,
    messageStartGame,
    setStartGame
};

let roomDataDispatch;
let startGameDispatch;

function configureAndRun(refreshLobby, refreshRooms, refreshRoomUsers) {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
            }
        },
        messages: {
            refreshLobby: lobbyList => {
                refreshLobby(lobbyList);
            },
            updateData: user => {
                storageService.storeId(user.id);
                storageService.storeName(user.name);
            },
            refreshRooms: roomList => {
                refreshRooms(roomList);
            },
            refreshRoomUsers: roomUserList => {
                refreshRoomUsers(roomUserList);
            },
            roomDetailsResponse: roomDetails => {
                roomDataDispatch(roomDetails);
            },
            startGame: arg => {
                startGameDispatch();
            }
        },
        initialData: storageService.getUser()
    });
    cloak.run(config.cloakAddress);
}

function messageSetUsername(username) {
    cloak.message('setUsername', username);
}

function messageCreateRoom(roomname) {
    cloak.message('createRoom', roomname);
}

function messageJoinRoom(roomId) {
    cloak.message('joinRoom', roomId);
}

function messageLeaveRoom() {
    cloak.message('leaveRoom');
}

function isConnected() {
    return cloak.connected();
}

function getRoomData(roomId, dispatch) {
    roomDataDispatch = dispatch;
    cloak.message('roomDetails', roomId);
}

function messageStartGame() {
    cloak.message('startGame');
}

function setStartGame(dispatch) {
    startGameDispatch = dispatch;
}