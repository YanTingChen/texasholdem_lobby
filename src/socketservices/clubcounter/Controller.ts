import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('ClubCounterController')
export default class ClubCounterController {
    constructor(@inject('ClubCounterServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_CLUB_SEARCH_POINT: // 所有玩家籌碼
                const searchResult = await this.service.searchPoint(data.data).catch((err) => err);
                if (searchResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_SEARCH_POINT, searchResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, searchResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_POINT: // 俱樂部總籌碼
                const clubPointResult = await this.service.getClubPoint(data.data).catch((err) => err);
                if (clubPointResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_POINT, clubPointResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, clubPointResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_BUY_POINT: // 購買鬍子幣
                const buyPointResult = await this.service.buyPoint(data.data).catch((err) => err);
                if (buyPointResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_BUY_POINT, buyPointResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, buyPointResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_SEND_OUT: // 發放籌碼
                const sendOutResult = await this.service.sendOut(data.data).catch((err) => err);
                if (sendOutResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_SEND_OUT, sendOutResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, sendOutResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_CLAIM_BACK: // 回收籌碼
                const claimBackResult = await this.service.claimBack(data.data).catch((err) => err);
                if (claimBackResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_CLAIM_BACK, claimBackResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, claimBackResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_TRADE_RECORD: // 收發紀錄
                const tradeRecordResult = await this.service.tradeRecord(data.data).catch((err) => err);
                if (tradeRecordResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_TRADE_RECORD, tradeRecordResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, tradeRecordResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_SEND_GIFT:
                break;
            case LobbyListen.PROTOCOL_CLUB_SEND_OUT_PROXY_POINT: // 給予代理發放額度
                const proxySendOutResult = await this.service.proxySendOut(data.data).catch((err) => err);
                if (proxySendOutResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_SEND_OUT_PROXY_POINT, proxySendOutResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, proxySendOutResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_CLAIM_BACK_PROXY_POINT: // 回收代理發放額度
                const proxyClaimBackResult = await this.service.proxyClaimBack(data.data).catch((err) => err);
                if (proxyClaimBackResult.status) {
                    ws.send(LobbySend.CLUB_COUNTER, LobbySend.PROTOCOL_CLUB_CLAIM_BACK_PROXY_POINT,
                         proxyClaimBackResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, proxyClaimBackResult);
                }
                break;
        }
    }
}
