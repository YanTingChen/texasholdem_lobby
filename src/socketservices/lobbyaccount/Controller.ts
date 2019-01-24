import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import mailService from '../../services/mail/Service';
import Service from './Service';

@provide('LobbyAccountController')
export default class LobbyAccountController {
    constructor(@inject('LobbyAccountServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_ACCOUNT_CHANGE_USER_NAME: // 更改使用者名稱
                const newUserName = await this.service.modifyUserName(data.data).catch((err) => err);
                if (newUserName.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNT, LobbySend.PROTOCOL_ACCOUNT_CHANGE_USER_NAME, newUserName);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, newUserName);
                }
                break;
            case LobbyListen.PROTOCOL_ACCOUNT_CHANGE_PASSWORD: // 更換密碼
                const newPassword = await this.service.resetPassword(data.data).catch((err) => err);
                if (newPassword.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNT, LobbySend.PROTOCOL_ACCOUNT_CHANGE_PASSWORD, newPassword);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, newPassword);
                }
                break;

            case LobbyListen.PROTOCOL_ACCOUNT_CHANGE_AVATAR: // 換大頭照
                const newAvatar = await this.service.resetAvatar(data.data).catch((err) => err);
                if (newAvatar.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNT, LobbySend.PROTOCOL_ACCOUNT_CHANGE_AVATAR, newAvatar);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, newAvatar);
                }
                break;
            case LobbyListen.PROTOCOL_ACCOUNT_BIND_EMAIL: // 綁定信箱
                const bindEmailResult = await this.service.bindEmail(data.data).catch((err) => err);
                if (bindEmailResult.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNT, LobbySend.PROTOCOL_ACCOUNT_BIND_EMAIL, bindEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, bindEmailResult);
                }
                break;
            case LobbyListen.PROTOCOL_ACCOUNT_CANCEL_BIND_EMAIL: // 取消綁定信箱
                const cancelBindEmailResult = await this.service.cancelBindEmail(data.data).catch((err) => err);
                if (cancelBindEmailResult.status) {
                    ws.send(LobbySend.LOBBY_ACCOUNT, LobbySend.PROTOCOL_ACCOUNT_BIND_EMAIL, cancelBindEmailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, cancelBindEmailResult);
                }
                break;
        }
    }
}
