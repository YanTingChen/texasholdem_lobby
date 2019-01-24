import { verify } from 'jsonwebtoken';
import * as _ from 'lodash';
import 'reflect-metadata';
import config from '../../config/config.app';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyGeneralServer')
export default class LobbyGeneralServer extends BaseService {
    constructor(@inject('LobbyGeneralRepository') private repository: Repository) {
        super();
    }

    public async getLobbyInit(data: any): Promise<any> {
        const res = await this.repository.getLobbyInit();
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getTableType(): Promise<any> {
        const res = await this.repository.getTableType();
        return res;
    }

    public async getEmailList(data: any): Promise<any> {
        const res = await this.repository.getEmailList(data.no);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async readEmail(data: any): Promise<any> {
        const res = await this.repository.readEmail(data.no, data.mailNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async delEmail(data: any): Promise<any> {
        const res = await this.repository.delEmail();
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async useItem(data: any): Promise<any> {
        const res = await this.repository.useItem();
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
    public async getVIP(data: any): Promise<any> {
        const res = await this.repository.getVIP();
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'buy VIP error !!');
    }
    public async getFeeback(data: any): Promise<any> {
        const res = await this.repository.getFeeback(data.no, data.title, data.text, data.type);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'get Feeback error !!');
    }
    public async getFeebackRecord(data: any): Promise<any> {
        const res = await this.repository.getFeebackRecord(data.no);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'get Feeback Record error !!');
    }

}
