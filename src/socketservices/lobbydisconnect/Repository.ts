import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('LobbyDisconnectRepository')
export default class LobbyDisconnectRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async delPlayer(id: any, wsId: string) {
        const key = MemberRedis.HASH_MEMBER_ONLINE;
        const socketId = await this.redisManger.hget(key, id);
        if (socketId === wsId) {
            await this.redisManger.hdel(key, id);
        }
    }
}
