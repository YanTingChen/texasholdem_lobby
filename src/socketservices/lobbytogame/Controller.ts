import * as log4js from 'koa-log4';
import * as _ from 'lodash';
import 'reflect-metadata';
import { ErrorStatusCode } from '../../config/enum.http';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import { memberSocket } from '../../models/MemberSocket';
import SocketExceptions from '../../models/SocketExceptions';
import WsEntity from '../../models/WsEntity';
import Service from './Service';
const _log = log4js.getLogger('WebSocketProvideController');

@provide('LobbyToGameController')
export default class LobbyConnectionController {
    constructor(@inject('LobbyToGameServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_SERVER_LEAVEDESK:
                const res = await this.service.callGameLeaveDesk(
                    data.data.no, data.data.token);
                if (res.status) {
                    ws.send(LobbySend.LOBBY_TO_GAME, LobbySend.PROTOCOL_SERVER_LEAVEDESK, res.result);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, res);
                }
                break;
        }
    }
}
