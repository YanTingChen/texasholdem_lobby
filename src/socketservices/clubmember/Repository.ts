import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('ClubMemberRepository')
export default class ClubMemberRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async getMessage(no: number, agentNo: number, clubNo: number): Promise<any> {
        const data = {
            c: 54,
            d: {
                no,
                agentNo,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async getDownStream(no: number, agentNo: number, clubNo: number): Promise<any> {
        const data = {
            c: 54,
            d: {
                no,
                agentNo,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async getProxyCredit(no: number, member: number, clubNo: number, point: number, code): Promise<any> {
        const data = {
            c: code,
            d: {
                no,
                member,
                clubNo,
                point,
                type: 1
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async setDownstream(no: number, agentNo: number, clubNo: number, agent_member: any): Promise<any> {
        const data = {
            c: 46,
            d: {
                no,
                clubNo,
                agentNo,
                agent_member
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
}
