import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('LobbyAnnouncementController')
export default class LobbyAnnouncementController {
    constructor(@inject('LobbyAnnouncementServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_ANNOUNCEMENT_GET_LIST: // 公告 - 取得所有公告
                const announmentList = await this.service.getAnnounmentList(data.data).catch((err) => err);
                if (announmentList.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNCEMENT, LobbySend.PROTOCOL_ANNOUNCEMENT_GET_LIST, announmentList);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, announmentList);
                }
                break;
        }
    }
}
