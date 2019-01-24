import * as geoip from 'geoip-lite';
import * as _ from 'lodash';
import 'reflect-metadata';
import { Constant } from '../../config/enum.constant';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyToGameServer')
export default class LobbyConnectionServer extends BaseService {
    constructor(@inject('LobbyToGameRepository') private repository: Repository) {
        super();
    }

    public async callGameLeaveDesk(no, token): Promise<any> {
        return this.repository.callGameLeaveDesk(no, token);
    }

}
