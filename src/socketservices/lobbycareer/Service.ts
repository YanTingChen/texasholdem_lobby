import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyCareerServer')
export default class LobbyCareerServer extends BaseService {
    constructor(@inject('LobbyCareerRepository') private repository: Repository) {
        super();
    }
    public async getCareerNormal(data: any): Promise<any> {
        const res = await this.repository.getCareerNormal();
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
}
