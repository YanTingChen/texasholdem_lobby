import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyCareerRepository')
export default class LobbyCareerRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getCareerNormal(): Promise<any> {
        const data = {
            c: 0,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
}
