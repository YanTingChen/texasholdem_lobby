import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { GameRedis } from '../../config/GameRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyAccountRepository')
export default class LobbyAccountRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async modifyUserName(no: number, nickname: string): Promise<any> {
        const data = {
            c: 6,
            d: {
                no,
                nickname
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async resetPassword(no: number, old_password: string, new_password: string): Promise<any> {
        const data = {
            c: 3,
            d: {
                no,
                old_password,
                new_password
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async buyVIP(no: number, vip: number): Promise<any> {
        const data = {
            c: 11,
            d: {
                no,
                vip
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async modifyEmail(no: number, email: string): Promise<any> {
        const data = {
            c: 4,
            d: {
                no,
                email
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async resetAvatar(no: number, img: string): Promise<any> {
        const data = {
            c: 5,
            d: {
                no,
                img
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    public async updateDiamond(no: number, diamond: number): Promise<any> {
        return this.redisManger.hmset(GameRedis.HASH_PLAYERINFO + no, 'diamond', diamond);
    }
    public async checkRedisNickName(no: number, nickname: string): Promise<any> {
        if (this.redisManger.exists(GameRedis.HASH_PLAYERINFO + no)) {
            return this.redisManger.hmset(GameRedis.HASH_PLAYERINFO + no, 'nickname', nickname);
        }
    }

}
