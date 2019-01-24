import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyGeneralRepository')
export default class LobbyGeneralRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async getLobbyInit(): Promise<any> {
        const data = {
            c: 49,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getTableType() {
        const res =  await this.sqlManager.callSP('CALL get_table_type()');
        if (res === undefined || res === 'undefined') {
            return 1;
        }
        return res;
    }

    public async getEmailList(no): Promise<any> {
        const data = {
            c: 20,
            d: {
                no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async readEmail(no, mailNo): Promise<any> {
        const data = {
            c: 21,
            d: {
                no,
                mailNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async delEmail(): Promise<any> {
        const data = {
            c: 49,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async useItem(): Promise<any> {
        const data = {
            c: 49,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getItemList(): Promise<any> {
        const data = {
            c: 49,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async getVIP(): Promise<any> {
        const data = {
            c: 23,
            d: {}
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async getFeeback(no, title, text, type): Promise<any> {
        const data = {
            c: 19,
            d: {
                no,
                title,
                text,
                type
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async getFeebackRecord(no): Promise<any> {
        const data = {
            c: 24,
            d: {
                no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

}
