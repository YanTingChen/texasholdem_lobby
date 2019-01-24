import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { Constant } from '../../config/enum.constant';
import { GameRedis } from '../../config/GameRedis';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyToGameRepository')
export default class LobbyConnectionRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async callGameLeaveDesk(no, token): Promise<any> {
        const desk = await this.redisManger.hget(
            GameRedis.HASH_PLAYERINFO + _.toString(no), 'table');
        const data = {
            reqData: { desk }
        };
        const res = await this.apiManager.httpPost(
            Backend.TEXASHOLDEM_GAME_LEAVEDESK_LINK,
            data,
            {Connection: 'close'},
            undefined,
            {bearer: token});
        return res.body;
    }

}
