import 'reflect-metadata';
import { ErrorStatusCode } from '../../config/enum.http';
import { LobbyListen } from '../../config/LobbyListen';
import { LobbySend } from '../../config/LobbySend';
import { inject, provide } from '../../ioc/ioc';
import { memberSocket } from '../../models/MemberSocket';
import WsEntity from '../../models/WsEntity';
import Service from './Service';

@provide('ClubAdminController')
export default class ClubAdminController {
    constructor(@inject('ClubAdminServer') private service: Service) {}
    public async on(
        ws: WsEntity,
        data: { protocol: string; data: any },
        ip: any
    ): Promise<any> {
        switch (data.protocol) {
            case LobbyListen.PROTOCOL_CLUB_CREATE: // 創建俱樂部
                const createResult = await this.service.createClub(data.data, ip).catch((err) => err);
                if (createResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_CREATE, createResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, createResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_EDIT: // 編輯俱樂部  名稱&公告
                const editResult = await this.service.editClub(data.data).catch((err) => err);
                if (editResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_EDIT, editResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, editResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_RESET_IMG: // 更換俱樂部頭像
                const resetImgResult = await this.service.resetClubImg(data.data).catch((err) => err);
                if (resetImgResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_SEARCH, resetImgResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, resetImgResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_SEARCH: // 搜尋俱樂部
                const searchResult = await this.service.searchClub(data.data).catch((err) => err);
                if (searchResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_SEARCH, searchResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, searchResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_JOIN: // 加入俱樂部
                const joinResult = await this.service.joinClub(data.data).catch((err) => err);
                if (joinResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_JOIN, joinResult.reData);
                    const getPlayerOnline = await this.service.getPlayerOnline(joinResult.creator);
                    if (getPlayerOnline) {
                        data.data.no = joinResult.creator;
                        const memberList = await this.service.getMemberList(data.data);
                        memberSocket.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_MEMBER_LIST,
                            memberList, joinResult.creator);
                    }
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, joinResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_QUIT: // 退出俱樂部
                const quitResult = await this.service.quitClub(data.data).catch((err) => err);
                if (quitResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_QUIT, quitResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, quitResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_DISBAND: // 解散俱樂部
                const disbandResult = await this.service.disbandClub(data.data).catch((err) => err);
                if (disbandResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_DISBAND, disbandResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, disbandResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_TABLE_LIST: // 取得牌桌列表
                const tableListResult = await this.service.getTableList(data.data).catch((err) => err);
                if (tableListResult !== []) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_TABLE_LIST, tableListResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, tableListResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_MEMBER_LIST: // 取得俱樂部所有會員
                const getMemberListResult = await this.service.getMemberList(data.data).catch((err) => err);
                if (getMemberListResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_MEMBER_LIST, getMemberListResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getMemberListResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_AGREE_JOIN: // 同意加入俱樂部
                const agreeJoinResult = await this.service.agreeJoinClub(data.data).catch((err) => err);
                if (agreeJoinResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_AGREE_JOIN, agreeJoinResult.reData);
                    const getPlayerOnline = await this.service.getPlayerOnline(data.data.apply_no);
                    if (getPlayerOnline) {
                        data.data.no = data.data.apply_no;
                        const joinClubList = await this.service.getJoinClubList(data.data);
                        memberSocket.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_JOIN_CLUB,
                            joinClubList, data.data.apply_no);
                        const sendNewMailMsg = {
                            status: true,
                            code: ErrorStatusCode.STATUS_NEW_MAIL_LOBBY,
                            clubName: agreeJoinResult.clubName
                        };
                        memberSocket.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_GETMSG
                            , sendNewMailMsg, data.data.apply_no);
                    }
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, agreeJoinResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_REFUSE_JOIN: // 拒絕加入俱樂部
                const refuseJoinResult = await this.service.refuseJoinClub(data.data).catch((err) => err);
                if (refuseJoinResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_REFUSE_JOIN, refuseJoinResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, refuseJoinResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_MEMBER: // 查詢對象會員資料
                const getMemberResult = await this.service.getMember(data.data).catch((err) => err);
                if (getMemberResult .status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_MEMBER, getMemberResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getMemberResult);
                }
                break;
                break;
            case LobbyListen.PROTOCOL_CLUB_CHANGE_MEMBER_TYPE: // 變更會員權限
                const changeMemberTypeResult = await this.service.changeMemberType(data.data).catch((err) => err);
                if (changeMemberTypeResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_CHANGE_MEMBER_TYPE, changeMemberTypeResult);
                    const online = await this.service.getPlayerOnline(data.data.member_no);
                    if (online) {
                        // 玩家在線上
                        const newData = {
                            status: true,
                            code: ErrorStatusCode.STATUS_NEW_MAIL_CLUB,
                            clubName: changeMemberTypeResult.clubName
                        };
                        memberSocket.send(LobbySend.LOBBY_GENERAL, LobbySend.PROTOCOL_GENERAL_GETMSG
                            , newData, data.data.member_no);
                    }
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, changeMemberTypeResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_DELETE_MEMBER: // 刪除俱樂部會員
                const delMemberResult = await this.service.delMember(data.data).catch((err) => err);
                if (delMemberResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_DELETE_MEMBER, delMemberResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, delMemberResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_MEMBER_REMARKS:
                const setRemarkResult = await this.service.setRemark(data.data).catch((err) => err);
                if (setRemarkResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_MEMBER_REMARKS, setRemarkResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, setRemarkResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_JOIN_CLUB: // 查詢已加入俱樂部
                const getClubResult = await this.service.getJoinClubList(data.data).catch((err) => err);
                if (getClubResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_JOIN_CLUB, getClubResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getClubResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_CLUB_DETAIL: // 取得俱樂部詳細資料
                const getClubDetailResult = await this.service.getClubDetail(data.data).catch((err) => err);
                if (getClubDetailResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_CLUB_DETAIL, getClubDetailResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getClubDetailResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_ADMIN_DATA: // 取得管理頁面資料
                const getAdminDataResult = await this.service.getAdminData(data.data).catch((err) => err);
                if (getAdminDataResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_ADMIN_DATA, getAdminDataResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getAdminDataResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_MESSAGE_PUSH:
                break;
            case LobbyListen.PROTOCOL_CLUB_MESSAGE_RECEIVE:
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_MEMBER_CREDIT_LOG:
                const getMemberCreditResult = await this.service.getMemberCredit(data.data).catch((err) => err);
                if (getMemberCreditResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_CLUB_DETAIL, getMemberCreditResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getMemberCreditResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_JACKPOT:
                break;
            case LobbyListen.PROTOCOL_CLUB_DEPOSIT_JACKPOT:
                break;
            case LobbyListen.PROTOCOL_CLUB_JACKPOT_RECORD:
                break;
            case LobbyListen.PROTOCOL_CLUB_GET_LEVEL_UP_CLUB_DETAIL: // 取得俱樂部等級
                const getlevelUpClubResult = await this.service.getLevelUpClub(data.data).catch((err) => err);
                if (getlevelUpClubResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_CLUB_DETAIL, getlevelUpClubResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, getlevelUpClubResult);
                }
                break;
            case LobbyListen.PROTOCOL_CLUB_LEVEL_UP_CLUB: // 購買俱樂部等級
                const setlevelUpClubResult = await this.service.setLevelUpClub(data.data).catch((err) => err);
                if (setlevelUpClubResult.status) {
                    ws.send(LobbySend.CLUB_ADMIN, LobbySend.PROTOCOL_CLUB_GET_CLUB_DETAIL, setlevelUpClubResult);
                } else {
                    ws.send(LobbySend.LOBBY_ERROR, LobbySend.PROTOCOL_ERROR, setlevelUpClubResult);
                }
                break;
        }
    }
}
