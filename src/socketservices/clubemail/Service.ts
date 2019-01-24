import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('ClubEmailServer')
export default class ClubEmailServer extends BaseService {
    constructor(@inject('ClubEmailRepository') private repository: Repository) {
        super();
    }
    public async getEmailClub(data: any): Promise<any> {
        const res = await this.repository.getEmailClub(data.no, data.clubNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'get Email error !!');
    }
    public async readEmailClub(data: any): Promise<any> {
        const res = await this.repository.readEmailClub(data.no, data.clubNo, data.mailNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'read Email error !!');
    }
    public async delEmailClub(data: any): Promise<any> {
        const res = await this.repository.delEmailClub(data.no, data.img);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'delete Email error !!');
    }
}
