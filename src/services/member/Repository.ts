import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { GameRedis } from '../../config/GameRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('MemberRepository')
export default class MemberRepository extends BaseRepository {
    constructor() { super(); }

    public async getMember(id): Promise<any> {
        const data = await this.apiManager.httpPost('127.0.0.1:3100/mock/getmember', {id});
        if (data.body.status === 1) {
            return data.body.result;
        }
        return 0;
    }
    // 修改密碼
    public async modifyPassword(id, password): Promise<any> {
        const data = {
            c: 3,
            d: {
                no: id,
                password
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return 1;
        }
        return res.body.e;
    }
    // 修改暱稱
    public async modifyNickname(id, nickname): Promise<any> {
        const data = {
            c: 6,
            d: {
                no: id,
                nickname
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return 1;
        }
        return res.body.e;
    }
    public async updateDiamond(no: number, diamond: number): Promise<any> {
        return this.redisManger.hmset(GameRedis.HASH_PLAYERINFO + no, 'diamond', diamond);
    }
}
