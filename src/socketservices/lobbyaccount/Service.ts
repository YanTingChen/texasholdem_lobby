import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyAccountServer')
export default class LobbyAccountServer extends BaseService {
    constructor(@inject('LobbyAccountRepository') private repository: Repository) {
        super();
    }
    public async modifyUserName(data: any): Promise<any> {
        const res = await this.repository.modifyUserName(data.no, data.nickname);
        if (res.s) {
            await this.repository.checkRedisNickName(data.no, data.nickname); // 檢查有無在playerInfo 更新暱稱
            if (res.d.diamond !== 'undefined' && res.d.diamond !== undefined) {  // 更新鑽石
                await this.repository.updateDiamond(data.no, _.toNumber(res.d.diamond));
            }
            return {
                status: true,
                nickname: res.d.nickname,
                diamond: res.d.diamond
            };
        }
        throw new SocketExceptions(res.e, 'Change UserName error !!');
    }
    public async resetPassword(data: any): Promise<any> {
        const res = await this.repository.resetPassword(data.no, data.old_password, data.new_password);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'Change Password error !!');
    }
    public async buyVIP(data: any): Promise<any> {
        const res = await this.repository.buyVIP(data.no, data.vip);
        if (res.s) {
            if (res.d.diamond !== 'undefined' && res.d.diamond !== undefined) {
                await this.repository.updateDiamond(data.no, _.toNumber(res.d.diamond));
            }
            return {
                status: true,
                diamond: res.d.diamond
            };
        }
        throw new SocketExceptions(res.e, 'buy VIP error !!');
    }
    public async modifyEmail(data: any): Promise<any> {
        const res = await this.repository.modifyEmail(data.no, data.email);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'Change Email error !!');
    }
    public async resetAvatar(data: any): Promise<any> {
        const res = await this.repository.resetAvatar(data.no, data.img);
        if (res.s) {
            res.d.img = res.d;
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Change Avatar error !!');
    }
    public async bindEmail(data: any): Promise<any> {
        const res = await this.repository.modifyEmail(data.no, data.email);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'bind Email error !!');
    }
    public async cancelBindEmail(data: any): Promise<any> {
        const res = await this.repository.modifyEmail(data.no, '');
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'cancel bind Email error !!');
    }
}
