import * as _ from 'lodash';
import 'reflect-metadata';
import { Backend } from '../../config/enum.backend';
import { GameRedis } from '../../config/GameRedis';
import { MemberRedis } from '../../config/MemberRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('ClubAdminRepository')
export default class ClubAdminRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async updateAmount(no: number, clubNo: number, amount: number): Promise<any> {
        return this.redisManger.hmsetObject(GameRedis.HASH_PLAYERINFO + no,
            {amount, disconnectionAmount: amount, clubNo});
    }

    public async updateDiamond(no: number, clubNo: number, diamond: number): Promise<any> {
        return this.redisManger.hmsetObject(GameRedis.HASH_PLAYERINFO + no,
            {diamond, clubNo});
    }

    public async createClub(no: number, location: string, ip: string): Promise<any> {
        const data = {
            c: 30,
            d: {
                no,
                location,
                ip
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async editClub(no: number, clubNo: number, clubName: string, proclamation: string): Promise<any> {
        const data = {
            c: 37,
            d: {
                no,
                clubNo,
                clubName,
                proclamation
            }
        };

        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async resetClubImg(no: number, clubNo: number, img: string): Promise<any> {
        const data = {
            c: 38,
            d: {
                no,
                clubNo,
                img
            }
        };

        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async setRemark(no, clubNo, member, notename, note): Promise<any> {
        const data = {
            c: 60,
            d: {
                no,
                clubNo,
                member,
                notename,
                note
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getClubDetail(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 45,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getAdminData(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 61,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async searchClub(clubNo: number): Promise<any> {
        const data = {
            c: 31,
            d: {
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async joinClub(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 32,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async quitClub(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 33,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async disbandClub(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 34,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getTableList(clubNo: number): Promise<any> {
        const key = GameRedis.LIST_CLUB_LIST + _.toString(clubNo);
        const res = await this.redisManger.lrange(key, 0, -1);
        const result: any[] = [];
        let i = 0;
        while (i < res.length) {
            const desk = await this.redisManger.lindex(key, i);
            const deskKey = GameRedis.HASH_DESKINFO + _.toString(desk);
            const deskinfo = await this.redisManger.hgetall(deskKey);
            if (deskinfo === null || deskinfo === 'null' || deskinfo === 'NaN') {
                await this.redisManger.lrem(key, 0, desk);
            } else {
                result[i] = {
                    game: _.toNumber(deskinfo.game),
                    tableId: deskinfo.channelName,
                    type: _.toNumber(deskinfo.type),
                    name: deskinfo.name,
                    bb: _.toNumber(deskinfo.dBigCost),
                    ante: 0, // 前注還沒寫入
                    people: _.toNumber(deskinfo.deskPeople),
                    seat: _.toNumber(deskinfo.seatSpace),
                    game_time: deskinfo.game_time,
                    insurance: _.toNumber(deskinfo.insurance),
                    multdeal: _.toNumber(deskinfo.multdeal),
                    owner: deskinfo.owner
                };
            }
            ++i;
        }
        return result;
    }

    public async getMemberList(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 35,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async delMember(no: number, clubNo: number, member_no: number): Promise<any> {
        const data = {
            c: 36,
            d: {
                no,
                clubNo,
                member_no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }
    // 與上面一起使用
    public async getApplyList(no: number, clubNo: number): Promise<any> {
        const data = {
            c: 48,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async agreeJoinClub(no: number, clubNo: number, apply_no: number, apply_nickname: number): Promise<any> {
        const data = {
            c: 47,
            d: {
                no,
                clubNo,
                apply_no,
                apply_nickname,
                is_accept: 1
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async refuseJoinClub(no: number, clubNo: number, apply_no: number, apply_nickname: number): Promise<any> {
        const data = {
            c: 47,
            d: {
                no,
                clubNo,
                apply_no,
                apply_nickname,
                is_accept: 0
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getMember(no: number, clubNo: number, member_no: number): Promise<any> {
        const data = {
            c: 39,
            d: {
                no,
                clubNo,
                member_no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async changeMemberType(no: number, clubNo: number, member_no: number, member_lv: number
        , is_serve: number): Promise<any> {
        const data = {
            c: 40,
            d: {
                no,
                clubNo,
                member_no,
                member_lv,
                is_serve
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getJoinClubList(no: number): Promise<any> {
        const data = {
            c: 8,
            d: {
                no
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getMemberCredit(no, clubNo, member): Promise<any> {
        const data = {
            c: 64,
            d: {
                no,
                clubNo,
                member
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getLevelUpClub(no, clubNo): Promise<any> {
        const data = {
            c: 68,
            d: {
                no,
                clubNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async setLevelUpClub(no, clubNo, lvNo): Promise<any> {
        const data = {
            c: 69,
            d: {
                no,
                clubNo,
                lvNo
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async getPlayerOnline(no): Promise<any> {
        const res = await this.redisManger.hmget(MemberRedis.HASH_MEMBER_ONLINE, _.toString(no));
        return res[0];
    }
}
