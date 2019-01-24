import * as _ from 'lodash';
import * as moment from 'moment';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';
import Utils from '../../utils/Utils';
@provide('ForgetRepository')
export default class ForgetRepository extends BaseRepository {
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

    // 忘記密碼 API
    public async forget(account, password): Promise<any> {
        const data = {
            c: 3,
            d: {
                account,
                password
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        if (res.body.s) {
            return res.body.d;
        }
        return res.body.e;
    }
}
