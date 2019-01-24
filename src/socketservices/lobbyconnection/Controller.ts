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

@provide('LobbyConnectionController')
export default class LobbyConnectionController {
    constructor(@inject('LobbyConnectionServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.LOBBY_QUICK_LOGIN:
                await this.service.createPlayerList(data.data.no, ws);
                const res = await this.service.login(data.data.no, ip, data.data.device,
                    data.data.browser, data.data.platform);
                if (res.status) {
                    if (data.data.message) {
                        res.message = data.data.message;
                    }
                    ws.send(LobbySend.LOBBY_CONNECTION, LobbySend.LOBBY_QUICK_LOGIN, res);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, res);
                }
                break;
        }
    }

    public async checkOnline(no, data): Promise<any> {
        const online = await this.service.checkOnline(no);
        if (online) {
            // 重複登入
            this.setRepeatLogin(data.ws, data.no, data.data, data.ip);
        } else {
            memberSocket.setMemberWsList(data.no, data.ws);
            this.on(data.ws, data.data, data.ip)
            .catch((error) => {
                _log.error(error);
            });
        }
        return true;
    }

    public async setRepeatLogin(
        // beforeWsId,
        afterWS: WsEntity,
        no: number,
        data: { protocol: string; data: any },
        ip: any): Promise<any> {
        // 通知GameServer
        const res = await this.service.callGameDisconnect(no, data.data.token);
        if (res) {
            // 通知前登入者並斷線
            memberSocket.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR,
                new SocketExceptions(ErrorStatusCode.PLAYER_ONLINE, 'Account is logged in elsewhere !!'),
                no);
            const beforeWsId = await memberSocket.getWsId(no);
            await memberSocket.disconnect(no, beforeWsId);
            // 後登入者正常登入
            data.data.message = 'Account someone login !!';
            await this.on(afterWS, data, ip);
            await memberSocket.setMemberWsList(no, afterWS);
        }
    }
}
