import * as geoip from 'geoip-lite';
import * as _ from 'lodash';
import 'reflect-metadata';
import { Constant } from '../../config/enum.constant';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyConnectionServer')
export default class LobbyConnectionServer extends BaseService {
    constructor(@inject('LobbyConnectionRepository') private repository: Repository) {
        super();
    }
    public async createPlayerList(no: string, ws: any): Promise<any> {
        await this.repository.createPlayerList(no, ws._ws.id);
    }

    public async login(no: number, ip: string, device: string,
        browser: string, platform: string): Promise<any> {
        const geo = geoip.lookup(ip);
        const location = geo.country;
        const res = await this.repository.login(no, ip, device, browser, location, platform);
        if (res.s) {
            res.d.status = true;
            const playerInfo = await this.repository.getPlayerInfo(no);
            // 判斷玩家先前是否為斷線
            if (playerInfo.action === Constant.PLAYER_DISCONNECT &&
                playerInfo.table !== Constant.PLAYER_NO_TABLE) {
                const owner = await this.repository.getTableOwner(playerInfo.table);
                res.d.table = {
                    tableId: playerInfo.table,
                    owner
                };
            } else {
                await this.repository.initPlayer(res.d.nickname, res.d.no, res.d.diamond);
            }
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Lobby Login server error !!');
    }

    public async checkOnline(no): Promise<any> {
        return this.repository.checkOnline(no);
    }

    public async callGameDisconnect(no: number, token): Promise<any> {
        const table = await this.repository.getPlayerTable(no);
        if (table !== Constant.PLAYER_NO_TABLE) {
            // { status: 1, result: { msssage: 'success' } }
            const res = await this.repository.callGameDisconnect(no, token, table);
            return res.status;
        }
        return 1;
    }

}
