import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('ClubDataRepository')
export default class ClubDataRepository extends BaseRepository {
    constructor() {
        super();
    }
}
