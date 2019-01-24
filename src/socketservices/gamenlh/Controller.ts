import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('GameNLHController')
export default class GameNLHController {
    constructor(@inject('GameNLHServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_GAME_NLH_START: // open game
                const openResult = await this.service.startGame(data.data).catch((err) => err);
                // console.log('openResult', openResult);
                if (openResult.status) {
                    ws.send(LobbySend.GAME_NLH, LobbySend.PROTOCOL_GAME_NLH_START, openResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, openResult);
                }
                break;
        }
    }
}
