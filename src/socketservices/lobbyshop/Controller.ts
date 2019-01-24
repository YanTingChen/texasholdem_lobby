import 'reflect-metadata';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('LobbyShopController')
export default class LobbyShopController {
    constructor(@inject('LobbyShopServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_SHOP_GET_ITEM_LIST: // 取得商品與價錢
                const shopItemList = await this.service.getShopItemList(data.data).catch((err) => err);
                if (shopItemList.status) {
                    ws.send(LobbySend.LOBBY_SHOP, LobbySend.PROTOCOL_SHOP_GET_ITEM_LIST, shopItemList);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, shopItemList);
                }
                break;
        }
    }
}
