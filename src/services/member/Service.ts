import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import Exceptions from '../../models/Exceptions';
import Repository from './Repository';

@provide('MemberServer')
export default class Service extends BaseService {
    constructor(@inject('MemberRepository') private repository: Repository) { super(); }
    // 取得玩家資料
    public async getMember(id): Promise<any> {
        const res = await this.repository.getMember(id);
        if (res === 0) {
            throw new Exceptions(8001, 'member could not found');
        }
        return res;
    }
    // 修改密碼
    public async modifyPassword(id, password): Promise<any> {
        const res = await this.repository.modifyPassword(_.toString(id), password);
        if (res === 1) {
            return 'success';
        }
        throw new Exceptions(res, 'API server error');
    }

    // 修改暱稱
    public async modifyNickname(id, nickname): Promise<any> {
        const res = await this.repository.modifyNickname(_.toString(id), nickname);
        if (res === 1) {
            if (res.d.diamond) {
                await this.repository.updateDiamond(id, _.toNumber(res.d.diamond));
            }
            return 'success';
        }
        throw new Exceptions(res, 'API server error');
    }

}
