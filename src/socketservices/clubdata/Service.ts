import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('ClubDataServer')
export default class ClubDataServer extends BaseService {
    constructor(@inject('ClubDataRepository') private repository: Repository) {
        super();
    }
}
