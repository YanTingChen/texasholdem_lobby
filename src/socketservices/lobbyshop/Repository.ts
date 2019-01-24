import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyShopRepository')
export default class LobbyShopRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getShopItemList(): Promise<any> {
        const data = {
            c: 49,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
}
