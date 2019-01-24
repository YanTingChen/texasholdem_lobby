import * as geoip from 'geoip-lite';
import * as _ from 'lodash';
import 'reflect-metadata';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import Exceptions from '../../models/Exceptions';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('ClubAdminServer')
export default class ClubAdminServer extends BaseService {
    constructor(@inject('ClubAdminRepository') private repository: Repository) {
        super();
    }
    public async createClub(data: any, ip: any): Promise<any> {
        const geo = geoip.lookup(ip);
        const location = geo.country;
        const res = await this.repository.createClub(data.no, location, ip);
        if (res.s) {
            // 直接進入俱樂部
            const result = await this.repository.getClubDetail(data.no, res.d.clubNo);
            if (result.s) {
                result.d.clubNo = res.d.clubNo;
                result.d.status = true;
                return result.d;
            }
            throw new SocketExceptions(res.e, 'Server error !!');
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async editClub(data: any): Promise<any> {
        const res = await this.repository.editClub(data.no, data.clubNo, data.clubName, data.proclamation);
            // 直接進入俱樂部
        if (res.s) {
            if (res.d.diamond) {
                await this.repository.updateDiamond(data.no,  data.clubNo, _.toNumber(res.d.diamond));
            }
            res.d.clubNo =  data.clubNo;
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async resetClubImg(data: any): Promise<any> {
        const res = await this.repository.resetClubImg(data.no, data.clubNo, data.img);
            // 直接進入俱樂部
        if (res.s) {
            return {
                clubNo:  data.clubNo,
                no:  data.no,
                img: res.d,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async searchClub(data: any): Promise<any> {
        const res = await this.repository.searchClub(data.clubNo);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async joinClub(data: any): Promise<any> {
        const res = await this.repository.joinClub(data.no, data.clubNo);
        if (res.s) {
            return {
                reData: {
                    status: true,
                    message: 'success'
                },
                creator: res.d.creator,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async quitClub(data: any): Promise<any> {
        const res = await this.repository.quitClub(data.no, data.clubNo);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async disbandClub(data: any): Promise<any> {
        const res = await this.repository.disbandClub(data.no, data.clubNo);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getTableList(data: any): Promise<any> {
        const res = await this.repository.getTableList(data.clubNo);
        if (res === null || res === undefined || res === 'undefined') {
            return [];
        }
        return res;
        // throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getMemberList(data: any): Promise<any> {
        const res = await this.repository.getMemberList(data.no, data.clubNo);
        const res2 = await this.repository.getApplyList(data.no, data.clubNo);
        res.apply_member = [];
        if (res2.s) {
            res.apply_member = res2.d;
        }
        if (res.s) {
            return {
                status: true,
                clubNo: data.clubNo,
                member: res.d,
                apply_member: res.apply_member
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async delMember(data: any): Promise<any> {
        const res = await this.repository.delMember(data.no, data.clubNo, data.member_no);
        if (res.s) {
            return {
                status: true,
                no: data.no,
                clubNo: data.clubNo,
                member_no:  data.member_no
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async agreeJoinClub(data: any): Promise<any> {
        const res = await this.repository.agreeJoinClub(data.no, data.clubNo, data.apply_no, data.apply_nickname);
        if (res.s) {
            const reData: any = await this.getMemberList(data);
            return {
                clubName: res.d.clubName,
                reData,
                status: true
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async refuseJoinClub(data: any): Promise<any> {
        const res = await this.repository.refuseJoinClub(data.no, data.clubNo, data.apply_no, data.apply_nickname);
        if (res.s) {
            const returnData = await this.getMemberList(data);
            returnData.status = true;
            return returnData;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getMember(data: any): Promise<any> {
        const res = await this.repository.getMember(data.no, data.clubNo, data.member_no);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            res.d.no = data.no;
            res.d.member_no = data.member_no;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async changeMemberType(data: any): Promise<any> {
        const res = await this.repository.changeMemberType(data.no, data.clubNo, data.member_no
            , data.member_lv, data.is_serve);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            res.d.member_no = data.member_no;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getJoinClubList(data: any): Promise<any> {
        const res = await this.repository.getJoinClubList(data.no);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async setRemark(data: any): Promise<any> {
        const res = await this.repository.setRemark(data.no, data.clubNo, data.member, data.notename, data.note);
        if (res.s) {
            return {
                status: true,
                message: 'success'
            };
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getClubDetail(data: any): Promise<any> {
        const res = await this.repository.getClubDetail(data.no, data.clubNo);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateAmount(data.no, data.clubNo, res.d.point);
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
    public async getAdminData(data: any): Promise<any> {
        const res = await this.repository.getAdminData(data.no, data.clubNo);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
    public async getMemberCredit(data: any): Promise<any> {
        const res = await this.repository.getMemberCredit(data.no, data.clubNo, data.member);
        if (res.s) {
            res.d.status = true;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
    public async getLevelUpClub(data: any): Promise<any> {
        const res = await this.repository.getLevelUpClub(data.no, data.clubNo);
        if (res.s) {
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }
    public async setLevelUpClub(data: any): Promise<any> {
        const res = await this.repository.setLevelUpClub(data.no, data.clubNo, data.lvNo);
        if (res.s) {
            if (res.d.diamond) {
                await this.repository.updateDiamond(data.no,  data.clubNo, _.toNumber(res.d.diamond));
            }
            res.d.status = true;
            res.d.clubNo = data.clubNo;
            await this.repository.updateDiamond(data.no, data.clubNo, res.d.diamond);
            return res.d;
        }
        throw new SocketExceptions(res.e, 'Server error !!');
    }

    public async getPlayerOnline(no): Promise<any> {
        return this.repository.getPlayerOnline(no);
    }

}
