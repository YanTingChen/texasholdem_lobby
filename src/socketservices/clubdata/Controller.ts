import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('ClubDataController')
export default class ClubDataController {
    constructor(@inject('ClubDataServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
        }
    }
}
