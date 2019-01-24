import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('ClubEmailRepository')
export default class ClubEmailRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getEmailClub(no, clubNo): Promise<any> {
        const data = {
            c: 50,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async readEmailClub(no, clubNo, emailNo): Promise<any> {
        const data = {
            c: 51,
            d: {
                no,
                clubNo,
                emailNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async delEmailClub(no: number, email: string): Promise<any> {
        const data = {
            c: 5,
            d: {
                no,
                email
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
}
