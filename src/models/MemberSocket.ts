import * as _ from 'lodash';
import WsEntity from './WsEntity';
let memberWsList: any = {};
class MemberSocket {

    public async setMemberWsList(memberNo, ws: WsEntity) {
        memberWsList[memberNo] = ws;
        console.log('WS List : ', Object.keys(memberWsList));
    }

    public async send(event, protocol, data, memberNo) {
        memberWsList[memberNo].send(event, protocol, data);
    }

    public async disconnect(memberNo, socketId) {
        if (memberWsList[memberNo] &&
            socketId === memberWsList[memberNo]._ws.id) {
            memberWsList[memberNo].disconnect();
            memberWsList = _.omit(memberWsList, _.toString(memberNo));
            console.log('disconnect WS List 「', Object.keys(memberWsList));
        }
    }

    public async getWsId(memberNo) {
        return memberWsList[memberNo]._ws.id;
    }
}

export const memberSocket = new MemberSocket();
