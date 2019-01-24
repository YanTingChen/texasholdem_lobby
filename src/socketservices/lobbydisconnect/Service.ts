import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyDisconnectServer')
export default class LobbyDisconnectServer extends BaseService {
    constructor(@inject('LobbyDisconnectRepository') private repository: Repository) {
        super();
    }
    public async delPlayer(no: any, wsId: string) {
        await this.repository.delPlayer(no, wsId);
    }
}
