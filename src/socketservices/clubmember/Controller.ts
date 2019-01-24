import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('ClubMemberController')
export default class ClubMemberController {
    constructor(@inject('ClubMemberServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_CLUB_GET_PROXY_MESSAGE: // 取得代理信息
                const messageResult = await this.service.getDownStream(data.data).catch((err) => err);
                if (messageResult.status) {
                    ws.send(LobbySend.CLUB_MEMBER, LobbySend.PROTOCOL_CLUB_GET_PROXY_MESSAGE, messageResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, messageResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_PROXY_DOWNSTREAM: // 取得代理下線列表	可(勾選/取消)的列表
                const downStreamResult = await this.service.getDownStream(data.data).catch((err) => err);
                if (downStreamResult.status) {
                    ws.send(LobbySend.CLUB_MEMBER, LobbySend.PROTOCOL_CLUB_GET_PROXY_DOWNSTREAM, downStreamResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, downStreamResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_PROXY_CREDIT: // 取得代理授信(代理發放/回收下線籌碼)
                const getProxyCreditResult = await this.service.getProxyCredit(data.data).catch((err) => err);
                if (getProxyCreditResult.status) {
                    ws.send(LobbySend.CLUB_MEMBER, LobbySend.PROTOCOL_CLUB_GET_PROXY_CREDIT, getProxyCreditResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getProxyCreditResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_SET_PROXY_DOWNSTREAM: // 設定代理下線列表
                const setDownStreamResult = await this.service.setDownstream(data.data).catch((err) => err);
                if (setDownStreamResult.status) {
                    ws.send(LobbySend.CLUB_MEMBER, LobbySend.PROTOCOL_CLUB_SET_PROXY_DOWNSTREAM, setDownStreamResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, setDownStreamResult);
                }
                break;
        }
    }
}
