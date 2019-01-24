import * as geoip from 'geoip-lite';
import { sign } from 'jsonwebtoken';
import * as _ from 'lodash';
import 'reflect-metadata';
import config from '../../config/config.app';
import { ErrorStatusCode } from '../../config/enum.http';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import Exceptions from '../../models/Exceptions';
import Utils from '../../utils/Utils';
import Repository from './Repository';

@provide('LoginServer')
export default class Service extends BaseService {
    constructor(
        @inject('LoginRepository') private repository: Repository) { super(); }

    public async normalLoginCheck(account, password, ip, platform, device, browser): Promise<any> {
        const geo = geoip.lookup('118.163.216.85');
        // const geo = geoip.lookup(ip);
        const location = geo.country;
        const res = await this.repository.normalLoginToLobby(account, password, platform, device,
            ip, browser, location);
        const time = await this.repository.getDBCurrentTime();
        if (typeof(res) === 'number') {
            throw new Exceptions(res, 'login fail');
        } else {
            // const online = await this.repository.checkOnline(res.no);
            // if (online) {
            //     // 重複登入
            //     memberSocket.send(
            //         LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR,
            //         new Exceptions(ErrorStatusCode.PLAYER_ONLINE, 'Repeat Login'),
            //         res.no);
            //     memberSocket.disconnect(res.no);
            //     const callGame = await this.repository.callGameDisconnect(res.no);
            //     // throw new Exceptions(ErrorStatusCode.PLAYER_ONLINE, 'Player Online');
            // }
            const token = await sign({
                id: Utils.Encryption_AES_ECB_128(_.toString(res.no)),
                nickName: res.nickname,
                realName: res.realname,
                lastLoginTime: time
            }, config.jwt.privateKey, {
                expiresIn: config.jwt.expired
            });
            const key = await this.repository.insertRedis(token, res.no, res.realname, res.nickname, time);
            return {account, key, token};
        }
    }

    public async visitorLoginCheck(ip, platform, device, browser): Promise<any> {
        const geo = geoip.lookup('118.163.216.85');
        // const geo = geoip.lookup(ip);
        const location = geo.country;
        const res = await this.repository.visitorLoginToLobby(platform, device, ip, browser, location);
        const time = await this.repository.getDBCurrentTime();
        if (typeof(res) === 'number') {
            throw new Exceptions(res, 'Visitor login fail');
        } else {
            const token = await sign({
                id: Utils.Encryption_AES_ECB_128(_.toString(res.no)),
                lastLoginTime: time
            }, config.jwt.privateKey, {
                expiresIn: config.jwt.expired
            });
            res.token = token;
            res.key = await this.repository.insertRedis(token, res.no, '', '', time);
            return res;
        }
    }

    public async quickLoginCheck(no, ip, platform, device, browser): Promise<any> {
        const geo = geoip.lookup('118.163.216.85');
        // const geo = geoip.lookup(ip);
        const location = geo.country;
        const res = await this.repository.quickLoginToLobby(no, ip, platform, device, browser, location);
        const time = await this.repository.getDBCurrentTime();
        if (typeof(res) === 'number') {
            throw new Exceptions(res, 'Quick login fail');
        } else {
            // const online = await this.repository.checkOnline(res.no);
            // if (online) {
            //     // 重複登入
            //     memberSocket.send(
            //         LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR,
            //         new Exceptions(ErrorStatusCode.PLAYER_ONLINE, 'Repeat Login'),
            //         res.no);
            //     memberSocket.disconnect(res.no);
            //     // throw new Exceptions(ErrorStatusCode.PLAYER_ONLINE, 'Player Online');
            // }
            const token = await sign({
                id: Utils.Encryption_AES_ECB_128(_.toString(res.no)),
                lastLoginTime: time
            }, config.jwt.privateKey, {
                expiresIn: config.jwt.expired
            });
            const reData = { token };
            await this.repository.insertRedis(token, res.no, '', '', time);
            return reData;
        }
    }
}
