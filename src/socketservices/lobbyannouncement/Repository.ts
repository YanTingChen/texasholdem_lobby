import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyAnnouncementRepository')
export default class LobbyAnnouncementRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getAnnounmentList(no): Promise<any> {
        const data = {
            c: 16,
            d: {
                no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
}
