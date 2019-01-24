import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('ClubEmailController')
export default class ClubEmailController {
    constructor(@inject('ClubEmailServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_CLUB_GET_EMAIL_LIST: // 取得俱樂部郵件
                const getEmailResult = await this.service.getEmailClub(data.data).catch((err) => err);
                if (getEmailResult.status) {
                    ws.send(LobbySend.CLUB_EMAIL, LobbySend.PROTOCOL_CLUB_GET_EMAIL_LIST, getEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getEmailResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_READ_EMAIL: // 讀取俱樂部信件
                const readEmailResult = await this.service.readEmailClub(data.data).catch((err) => err);
                if (readEmailResult.status) {
                    ws.send(LobbySend.CLUB_EMAIL, LobbySend.PROTOCOL_CLUB_READ_EMAIL, readEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, readEmailResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_DELETE_EMAIL: // 刪除已讀郵件
                const delEmailResult = await this.service.delEmailClub(data.data).catch((err) => err);
                if (delEmailResult.status) {
                    ws.send(LobbySend.CLUB_EMAIL, LobbySend.PROTOCOL_CLUB_DELETE_EMAIL, delEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, delEmailResult);
                }
                break;
        }
    }
}
