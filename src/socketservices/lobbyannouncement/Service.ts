import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('LobbyAnnouncementServer')
export default class LobbyAnnouncementServer extends BaseService {
    constructor(@inject('LobbyAnnouncementRepository') private repository: Repository) {
        super();
    }
    public async getAnnounmentList(data: any): Promise<any> {
        const res = await this.repository.getAnnounmentList(data.no);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
}
