var mockery = require('mockery');

var cloak;
var cloakConfig;
var lobby;
var user;
var room;
var users;
var rooms;
var disconnect;

describe('cloak server', function() {
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(function() {
        mockery.registerAllowable('./cloak-server');
    });

    beforeEach(function() {
        cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'getLobby', 'getRooms', 'createRoom', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'removeMember']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember', 'messageMembers', 'getMembers']);
    });

    beforeEach(function() {
        cloak.getLobby.and.returnValue(lobby);

        cloak.configure.and.callFake(function(_config_) {
            cloakConfig = _config_;
        });

        mockery.registerMock('cloak', cloak);
    });

    beforeEach(function() {
        require('./cloak-server')({});
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    afterEach(function() {
        mockery.disable();
    });

    describe('cloak setup tests', () => {
        it('calls configure', function() {
            expect(cloak.configure).toHaveBeenCalled();
        });

        it('calls run', function() {
            expect(cloak.run).toHaveBeenCalled();
        });
    });

    describe('newMember', () => {
        it('on creating a new member, refreshLobby message sent with correct list of users', function() {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
        });

        it('on creating a new member, refreshRooms message sent with correct list of rooms', function() {
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});      
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshRooms', rooms);
        });
    });

    describe('setUserUp', () => {
        it('updates user correctly', function() {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(userData).toEqual(user.data);
        });

        it('sends updateData message', function() {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(user.message).toHaveBeenCalledWith('updateData', user.data);
        });
    });

    it('setUsername: sets user.name to the passed argument', function() {
        user.data = {name: "name", id: 0};
        lobby.getMembers.and.returnValue([]);

        cloakConfig.messages.setUsername('TEST_USERNAME', user);

        expect(user.name).toEqual('TEST_USERNAME');
    });


    describe('createRoom', () => {
        it('creates room with the passed argument', function() {
            user = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue({data:{creator:''}});

            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);
            expect(cloak.createRoom).toHaveBeenCalledWith('TEST_ROOM_NAME');
        });

        it('updates creator', function() {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.creator).toEqual(user);
        });
    });

    describe('joinRoom', () => {
        it('finds the room that has the ID passed as argument', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
        });

        it('makes the current user join the room with the correct ID', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(room.addMember).toHaveBeenCalledWith(user);
        });

        it('sets the score of the current user to 0', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            
            expect(user.data.score).toEqual(0);
        });
    });

    describe('refreshRoomUsers ', () => {
        it('the members of the correct room are retrieved', function() {
            room.getMembers.and.returnValue([]);

            cloakConfig.room.newMember.bind(room,'')();

            expect(room.getMembers).toHaveBeenCalledWith();
        });
        it('the members of the correct room are messaged to refreshRooms', function() {
            users = ['Raul', 'Jamie'];
            room.getMembers.and.returnValue(users);
            cloakConfig.room.newMember.bind(room,'')();

            expect(room.messageMembers).toHaveBeenCalledWith('refreshRoomUsers', users);
        });
    });

    describe('leaveRoom ', () => {
        it('the correct room is retrieved for the user', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};

            cloakConfig.messages.leaveRoom('', user);

            expect(user.getRoom).toHaveBeenCalled();
        });
        it('the correct user is removed from the room', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            
            cloakConfig.messages.leaveRoom('', user);

            expect(room.removeMember).toHaveBeenCalledWith(user);
        })
        it('the sets the score of the user user that is removed from the room to undefined', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            
            cloakConfig.messages.leaveRoom('', user);

            expect(user.data.score).toEqual(undefined);
        })
    });
});
