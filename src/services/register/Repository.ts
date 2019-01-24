import * as _ from 'lodash';
import * as moment from 'moment';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';
import Utils from '../../utils/Utils';
@provide('RegisterRepository')
export default class RegisterRepository extends BaseRepository {
    constructor() { super(); }

    // 驗證碼驗證
    public async verification(account, verificationCode): Promise<any> {
        const key = MemberRedis.HASH_MEMBER_MAIL + account;
        const code = await this.redisManger.get(key);
        if (code === verificationCode) {
            await this.redisManger.del(key);
            return 1;
        }
        return 0;
    }

    // 註冊 API
    public async register(account, password, platform, device, ip, browser, location): Promise<any> {
        const data = {
            c: 2,
            d: {
                account,
                password,
                device,
                ip,
                browser,
                location,
                platform
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return 1;
        }
        return res.body.e;
    }

    // 正常登入流程
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

    // 新增Redis
    public async insertRedis(token, id, time): Promise<any> {
        const key = MemberRedis.HASH_MEMBER_BARREL + Utils.findBarrel(id);
        const data = {};
        data[token] = Utils.DBTimeFormat(moment(time).add(5, 'days').toDate());
        await this.redisManger.hmsetObject(key, data);
        return key;
    }
}
