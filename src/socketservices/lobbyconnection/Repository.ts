import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { Constant } from '../../config/enum.constant';
import { GameRedis } from '../../config/GameRedis';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyConnectionRepository')
export default class LobbyConnectionRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async createPlayerList(id: any, wsId: any): Promise<any> {
        await this.redisManger.hset(MemberRedis.HASH_MEMBER_ONLINE, id, wsId);
    }

    public async login(no: number, ip: string, device: string,
        browser: string, location: string, platform: string): Promise<any> {
        const data = {
            c: 1,
            d: {
                no,
                ip,
                device,
                browser,
                location,
                platform
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getPlayerInfo(memberId: number): Promise<{action: string, table: string}> {
        const playerInfo = await this.redisManger.hmget(GameRedis.HASH_PLAYERINFO + memberId, 'action', 'table');
        return {
            action: playerInfo[0],
            table: playerInfo[1]
        };
    }

    public async getTableOwner(tableName): Promise<any> {
        return this.redisManger.hget(GameRedis.HASH_DESKINFO + _.toString(tableName), 'owner');
    }
    public async initPlayer(nickName: string, memberId: number, diamond): Promise<any> {
        const pipeline = this.redisManger.pipeline();
        return pipeline
            .del(GameRedis.LIST_POKER + memberId, GameRedis.HASH_PLAYERINFO + memberId)
            .hmset(GameRedis.HASH_PLAYERINFO + memberId, {
                table: -1,
                sessionRecordID: -1,
                channelName: '',
                seat: -1,
                nickName,
                amount: 0,
                disconnectionAmount: 0,
                handsAmount: -1,
                costTime: 0,
                diamond,
                bet: -1,
                action: Constant.STATUS_LOOK,
                countDown: -1,
                deskBetPool: -1,
                insurance: -1
            })
            .rpush(GameRedis.LIST_POKER + memberId, -1, -1)
            .exec();
    }

    public async getPlayerTable(no): Promise<any> {
        return this.redisManger.hget(GameRedis.HASH_PLAYERINFO + _.toString(no), 'table');
    }

    public async checkOnline(no): Promise<any> {
        return this.redisManger.hget(MemberRedis.HASH_MEMBER_ONLINE, _.toString(no));
    }

    public async callGameDisconnect(no: number, token, desk): Promise<any> {
        const data = {
            reqData: { desk }
        };
        const res = await this.apiManager.httpPost(
            Backend.TEXASHOLDEM_GAME_CONFLICT_LINK,
            data,
            {Connection: 'close'},
            undefined,
            {bearer: token});
        return res.body;
    }

}
