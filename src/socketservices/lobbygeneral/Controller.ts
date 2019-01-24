import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('LobbyGeneralController')
export default class LobbyGeneralController {
    constructor(@inject('LobbyGeneralServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_GENERAL_GET_RULE_LIST: // 開機設定檔
                const lobbyInit = await this.service.getLobbyInit(data.data).catch((err) => err);
                if (lobbyInit.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_GET_RULE_LIST, lobbyInit);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, lobbyInit);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_GET_TABLE_TYPE: // 取得桌子類別
                const typeResult = await this.service.getTableType().catch((err) => {
                    return err;
                });
                if (typeResult === 1) {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, typeResult);
                } else {
                    ws.send(LobbySend.GAME_NLH, LobbySend.PROTOCOL_GENERAL_GET_TABLE_TYPE, typeResult);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_GET_EMAIL_LIST: // 取得大廳信箱
                const emailList = await this.service.getEmailList(data.data).catch((err) => err);
                if (emailList.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_GET_EMAIL_LIST, emailList);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, emailList);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_READ_EMAIL: // 讀取信件
                const readEmailResult = await this.service.readEmail(data.data).catch((err) => err);
                if (readEmailResult.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_READ_EMAIL, readEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, readEmailResult);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_DELETE_EMAIL: // 刪除已讀郵件
                const delEmail = await this.service.delEmail(data.data).catch((err) => err);
                if (delEmail.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_DELETE_EMAIL, delEmail);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, delEmail);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_USE_ITEM: // 使用道具
                const useItem = await this.service.delEmail(data.data).catch((err) => err);
                if (delEmail.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_USE_ITEM, useItem);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, useItem);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_GETVIP: // 取得vip資訊
                const getVIPDAtaResult = await this.service.getVIP(data.data).catch((err) => err);
                if (getVIPDAtaResult.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_GETVIP, getVIPDAtaResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getVIPDAtaResult);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_FEEBACK: // 關於我-回饋功能
                const getFeebackResult = await this.service.getFeeback(data.data).catch((err) => err);
                if (getFeebackResult.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_FEEBACK, getFeebackResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getFeebackResult);
                }
                break;
            case LobbyListen.PROTOCOL_GENERAL_FEEBACK_RECORD: // 取得反饋紀錄
                const getFeebackRecord = await this.service.getFeebackRecord(data.data).catch((err) => err);
                if (getFeebackRecord.status) {
                    ws.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_FEEBACK_RECORD, getFeebackRecord);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getFeebackRecord);
                }
                break;
        }
    }
}
