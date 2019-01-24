import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('ClubMemberServer')
export default class ClubMemberServer extends BaseService {
    constructor(@inject('ClubMemberRepository') private repository: Repository) {
        super();
    }
    public async getMessage(data: any): Promise<any> {
        const res = await this.repository.getMessage(data.no, data.agentNo, data.clubNo);
        if (res.s) {
            return {
                no: data.member_no,
                agentNo: data.agentNo,
                clubNo: data.clubNo,
                agentMemberList: res.d,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'get downStream  error !!');
    }
    public async getDownStream(data: any): Promise<any> {
        const res = await this.repository.getDownStream(data.no, data.agentNo, data.clubNo);
        if (res.s) {
            return {
                no: data.member_no,
                agentNo: data.agentNo,
                clubNo: data.clubNo,
                agentMemberList: res.d,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'get downStream  error !!');
    }
    public async getProxyCredit(data: any): Promise<any> {
        let res;
        if (data.type === 1) {
            res = await this.repository.getProxyCredit(data.no, data.member, data.clubNo
                , _.toNumber(data.point), 43);
        } else {
            res = await this.repository.getProxyCredit(data.no, data.member, data.clubNo
                , _.toNumber(data.point), 44);
        }
        if (res.s) {
            // await this.repository.updateAmount(res.d.member, data.clubNo); // 修改籌碼
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'getProxyCredit error!!');
    }
    public async setDownstream(data: any): Promise<any> {
        const res = await this.repository.setDownstream(data.no, data.agentNo, data.clubNo, data.agent_member);
        if (res.s) {
            return {
                no: data.member_no,
                agentNo: data.agentNo,
                clubNo: data.clubNo,
                agentMemberList: res.d,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'set downStream  error !!');
    }
}
