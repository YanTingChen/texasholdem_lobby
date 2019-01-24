import * as _ from 'lodash';
import * as moment from 'moment';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';
import Utils from '../../utils/Utils';

@provide('LoginRepository')
export default class LoginRepository extends BaseRepository {

    constructor() { super(); }

    public async normalLoginToLobby(account, password, platform, device, ip, browser, location): Promise<any> {
        const data = {
            c: 1,
            d: {
                account,
                password,
                platform,
                device,
                ip,
                browser,
                location
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return res.body.d;
        }
        return res.body.e;
    }

    public async visitorLoginToLobby(platform, device, ip, browser, location): Promise<any> {
        // const data = await this.apiManager.httpPost('127.0.0.1:3100/mock/visitor', {platform, device, ip});
        // if (_.toNumber(data.body.status) === 1) {
        //     return data.body.result;
        // }
        const data = {
            c: 14,
            d: {
                device,
                ip,
                browser,
                location,
                platform
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return res.body.d;
        }
        return res.body.e;
        // const items = await this.redisManger.llen('{member:testing}:list');
        // const index = Math.floor(Math.random() * items);
        // const id = await this.redisManger.lindex('{member:testing}:list', index);
        // await this.redisManger.lrem('{member:testing}:list', -1, id);
        // const data1 = {
        //     no: _.toInteger(id),
        //     amount: 999999,
        //     diamond: 999999,
        //     nickName: Utils.getSelfChannelName(_.toString(id))
        // };
        // return data1;
    }

    public async quickLoginToLobby(no, ip, platform, device, browser, location): Promise<any> {
        const data = {
            c: 1,
            d: {
                no,
                platform,
                device,
                ip,
                browser,
                location
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return res.body.d;
        }
        return res.body.e;
    }

    public async insertRedis(token, id, realname, nickname, time): Promise<any> {
        const key = MemberRedis.HASH_MEMBER_BARREL + Utils.findBarrel(_.toNumber(id));
        const data = {};
        data[token] = Utils.DBTimeFormat(moment(time).add(3, 'days').toDate());
        await this.redisManger.hmsetObject(key, data);
        await this.redisManger.expire(key, 259200); // 3 day = 259,200s
        return key;
    }

    // public async checkOnline(no: string): Promise<any> {
    //     const res = await this.redisManger.hget(MemberRedis.HASH_MEMBER_ONLINE, no);
    //     return res;
    // }

    // public async callGameDisconnect(no): Promise<any> {
    //     const data = {
    //         reqData: {}
    //     };
    //     const allToken = await this.redisManger.hgetall(MemberRedis.HASH_MEMBER_BARREL + no);
    //     const memberToken = await Utils.getHgetAllKeyValue(allToken);
    //     const res = await this.apiManager.httpPost(
    //         Backend.TEXASHOLDEM_GAME_LINK,
    //         data,
    //         {Connection: 'close'},
    //         undefined,
    //         {bearer: memberToken.keyName[0]});
    //     console.log('res.body:: ', res.body);
    //     return res.body;
    // }

    // public async checkTokenExist(key, token): Promise<any> {
    //     const tokenExist = await this.redisManger.hexists(key, token);
    //     if (_.toNumber(tokenExist) === 0) {
    //         return 0;
    //     }
    //     return 1;
    // }

}
