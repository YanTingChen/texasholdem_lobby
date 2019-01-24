import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { GameRedis } from '../../config/GameRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';
import BaseUtils from '../../utils/BaseUtils';

@provide('ClubCounterRepository')
export default class ClubCounterRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getClubPoint(clubNo: number): Promise<any> {
        const data = {
            c: 41,
            d: {
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async buyPoint(no: number, clubNo: number, point: number, diamond: number): Promise<any> {
        const data = {
            c: 42,
            d: {
                no,
                clubNo,
                point,
                diamond
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async searchPoint(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 35,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    // type 1為發放  2為給代理發放額度
    public async sendOut(no: number, member: any, clubNo: number, point: number, type: number): Promise<any> {
        const data = {
            c: 43,
            d: {
                no,
                member,
                clubNo,
                point,
                type
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    // type 1為收回 2為收回代理額度
    public async claimBack(no: number, member: any, clubNo: number, point: number, type: number): Promise<any> {
        const data = {
            c: 44,
            d: {
                no,
                member,
                clubNo,
                point,
                type
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async updateAmount(member: any[] = [], clubNo): Promise<any> {
        let i = 0;
        const pipeline = await this.redisManger.pipeline();
        const pipeline2 = await this.redisManger.pipeline();
        while (i < member.length) {
            pipeline.hmget(GameRedis.HASH_PLAYERINFO +  member[i].member_no, 'clubNo');
            i++;
        }
        i = 0;
        const res = await pipeline.exec();
        while (i < res.length) {
            const a = await BaseUtils.getPipelineOneArray(res[i]);
            if (a[0] === clubNo) {
                pipeline2.hmset(GameRedis.HASH_PLAYERINFO +  member[i].member_no, {
                    amount: member[i].point,
                    disconnectionAmount: member[i].point
                });
            }
            i++;
        }
        return pipeline2.exec();
    }
    public async updateAmountAndDiamond(no, clubNo, amount, diamond): Promise<any> {
        return this.redisManger.hmsetObject(GameRedis.HASH_PLAYERINFO + no,   {amount, diamond, clubNo});
    }

    public async tradeRecord(clubNo: number, no: number): Promise<any> {
        const data = {
            c: 56,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    // public async sendGift(no: number, clubNo: number): Promise<any> {
    //     const data = {
    //         c: 49,
    //         d: {
    //         }
    //     };
    //     const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
    //     return res.body;
    // }

    // public async sendOutProxyPoint(no: number, clubNo: number): Promise<any> {
    //     const data = {
    //         c: 49,
    //         d: {
    //         }
    //     };
    //     const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
    //     return res.body;
    // }

    // public async claimBackProxyPoint(no: number, clubNo: number): Promise<any> {
    //     const data = {
    //         c: 49,
    //         d: {
    //         }
    //     };
    //     const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
    //     return res.body;
    // }

}
