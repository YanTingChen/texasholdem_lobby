import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('ClubCounterServer')
export default class ClubCounterServer extends BaseService {
    constructor(@inject('ClubCounterRepository') private repository: Repository) {
        super();
    }
    public async getClubPoint(data: any): Promise<any> {
        const res = await this.repository.getClubPoint(data.clubNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'get Club Point error !!');
    }
    public async buyPoint(data: any): Promise<any> {
        const res = await this.repository.buyPoint(data.no, data.clubNo, data.clubNo, data.diamond);
        if (res.s) {
            res.d.status = true;
            await this.repository.updateAmountAndDiamond(res.d.no, data.clubNo,
                _.toNumber(res.d.point), _.toNumber(res.diamond)); // 修改籌碼
            return res.d;
        }
        throw new SocketExceptions(res.e, 'get Club Point error !!');
    }
    public async searchPoint(data: any): Promise<any> {
        const res = await this.repository.searchPoint(data.no, data.clubNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async sendOut(data: any): Promise<any> {
        const res = await this.repository.sendOut(data.no, data.member, data.clubNo, data.point, 1);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateAmount(res.d.member, data.clubNo); // 修改籌碼
            return res.d;
        }
        throw new SocketExceptions(res.e, 'SendOut server error !!');
    }

    public async claimBack(data: any): Promise<any> {
        const res = await this.repository.claimBack(data.no, data.member, data.clubNo, data.point, 1);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateAmount(res.d.member, data.clubNo); // 修改籌碼
            return res.d;
        }
        throw new SocketExceptions(res.e, 'ClaimBack server error !!');
    }

    public async proxySendOut(data: any): Promise<any> {
        const res = await this.repository.sendOut(data.no, data.member, data.clubNo, data.point, 2);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateAmount(res.d.member, data.clubNo); // 修改籌碼
            return res.d;
        }
        throw new SocketExceptions(res.e, 'SendOut server error !!');
    }

    public async proxyClaimBack(data: any): Promise<any> {
        const res = await this.repository.claimBack(data.no, data.member, data.clubNo, data.point, 2);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateAmount(res.d.member, data.clubNo); // 修改籌碼
            return res.d;
        }
        throw new SocketExceptions(res.e, 'ClaimBack server error !!');
    }

    public async tradeRecord(data: any): Promise<any> {
        const res = await this.repository.tradeRecord(data.clubNo, data.no);
        if (res.s) {
            const result: any = {} ;
            result.status = true;
            result.clubNo = data.clubNo;
            result.tradeRecordList = res.d;
            return result;
        }
        throw new SocketExceptions(res.e, 'TradeRecord server error !!');
    }

    // public async sendOutProxyPoint(data: any): Promise<any> {
    //     const res = await this.repository.sendOutProxyPoint(data.no, data.clubNo);
    //     if (res.s) {
    //         res.d.status = true;
    //         return res.d;
    //     }
    //     throw new SocketExceptions(res.e, 'Server error !!');
    // }

    // public async claimBackProxyPoint(data: any): Promise<any> {
    //     const res = await this.repository.claimBackProxyPoint(data.no, data.clubNo);
    //     if (res.s) {
    //         res.d.status = true;
    //         return res.d;
    //     }
    //     throw new SocketExceptions(res.e, 'Server error !!');
    // }
}
