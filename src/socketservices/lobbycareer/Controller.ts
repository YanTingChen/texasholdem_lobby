import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('LobbyCareerController')
export default class LobbyCareerController {
    constructor(@inject('LobbyCareerServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_CAREER_GET_NLH_NORMAL: // 取得俱樂部常規局戰績
                const careerNormal = await this.service.getCareerNormal(data.data).catch((err) => err);
                if (careerNormal.status) {
                    ws.send(LobbySend.LOBBY_CAREER, LobbySend.PROTOCOL_CAREER_GET_NLH_NORMAL, careerNormal);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, careerNormal);
                }
                break;
        }
    }
}
