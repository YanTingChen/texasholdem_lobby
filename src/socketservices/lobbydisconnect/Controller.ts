import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('LobbyDisconnectController')
export default class LobbyDisconnectController {
    constructor(@inject('LobbyDisconnectServer') private service: Service) {}
    public async on(
        no: number,
        wsId: string
    ): Promise<any> {
        await this.service.delPlayer(no, wsId);
    }
}
