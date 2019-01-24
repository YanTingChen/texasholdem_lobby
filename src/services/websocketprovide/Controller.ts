import { all, controller, cookies,
    httpDelete, httpGet, httpHead, httpMethod, httpPatch,
    httpPost, httpPut, next, queryParam,
    request, requestBody, requestHeaders, requestParam, response, TYPE } from 'inversify-koa-utils';
import { verify, VerifyErrors} from 'jsonwebtoken';
import * as log4js from 'koa-log4';
import * as _ from 'lodash';
import 'reflect-metadata';
import config from '../../config/config.app';
import { ErrorStatusCode } from '../../config/enum.http';
import { LobbySend } from '../../config/LobbySend';
import { SocketConstant } from '../../config/SocketConstant';
import { inject, provideNamed } from '../../ioc/ioc';
import { memberSocket } from '../../models/MemberSocket';
import SocketExceptions from '../../models/SocketExceptions';
import WebSocketContext from '../../models/WebSocketContext';
import WsEntity from '../../models/WsEntity';
import ClubAdminController from '../../socketservices/clubadmin/Controller';
import ClubCounterController from '../../socketservices/clubcounter/Controller';
import ClubDataController from '../../socketservices/clubdata/Controller';
import ClubEmailController from '../../socketservices/clubemail/Controller';
import ClubMemberController from '../../socketservices/clubmember/Controller';
import GameNLHController from '../../socketservices/gamenlh/Controller';
import LobbyAccountController from '../../socketservices/lobbyaccount/Controller';
import LobbyAnnouncementController from '../../socketservices/lobbyannouncement/Controller';
import LobbyCareerController from '../../socketservices/lobbycareer/Controller';
import LobbyConnectionController from '../../socketservices/lobbyconnection/Controller';
import LobbyDisconnectController from '../../socketservices/lobbydisconnect/Controller';
import LobbyGeneralController from '../../socketservices/lobbygeneral/Controller';
import LobbyShopController from '../../socketservices/lobbyshop/Controller';
import LobbyToGameController from '../../socketservices/lobbytogame/Controller';
import PublishController from '../../socketservices/publish/Controller';
import Utils from '../../utils/Utils';
const _log = log4js.getLogger('WebSocketProvideController');

let memberList: any = {};
@provideNamed(TYPE.Controller, 'WebSocketProvideController')
export default class WebSocketProvideController {
    // public memberList: any = {};
    public id = 0;
    private constructor(
        @inject('ClubAdminController') private clubAdminController: ClubAdminController,
        @inject('ClubCounterController') private clubCounterController: ClubCounterController,
        @inject('ClubDataController') private clubDataController: ClubDataController,
        @inject('ClubEmailController') private clubEmailController: ClubEmailController,
        @inject('ClubMemberController') private clubMemberController: ClubMemberController,
        @inject('GameNLHController') private gameNLHController: GameNLHController,
        @inject('LobbyAccountController') private lobbyAccountController: LobbyAccountController,
        @inject('LobbyAnnouncementController') private lobbyAnnouncementController: LobbyAnnouncementController,
        @inject('LobbyCareerController') private lobbyCareerController: LobbyCareerController,
        @inject('LobbyConnectionController') private lobbyConnectionController: LobbyConnectionController,
        @inject('LobbyDisconnectController') private lobbyDisconnectController: LobbyDisconnectController,
        @inject('LobbyGeneralController') private lobbyGeneralController: LobbyGeneralController,
        @inject('LobbyShopController') private lobbyShopController: LobbyShopController,
        @inject('PublishController') private publishController: PublishController,
        @inject('LobbyToGameController') private lobbyToGameController: LobbyToGameController
    ) {
        this.on();
    }
    private  on() {
        WebSocketContext.getInstance().onConnection((ws: WsEntity, req, head) => {
            _log.info(SocketConstant.CONNECTION, req.connection.remoteAddress);
            const wsId = ws.getId();
            ws.on(SocketConstant.LOBBY_CONNECTION, (data) => {
                const player = verify(data.data.token, config.jwt.privateKey);
                this.id = _.toNumber(Utils.Decryption_AES_ECB_128(JSON.parse(JSON.stringify(player)).id));
                data.data.no = this.id;
                const checkData = {
                    ws,
                    no: this.id,
                    data,
                    ip: req.connection.remoteAddress
                };
                this.lobbyConnectionController.checkOnline(this.id, checkData)
                .catch((error) => {
                    _log.error(error);
                });
                memberList[wsId] = this.id;
                console.log('memberList', memberList, Object.keys(memberList).length);
                // this.lobbyConnectionController.on(ws, data, req.connection.remoteAddress)
                // .catch((error) => {
                //     _log.error(error);
                // });
            });
            ws.on(SocketConstant.LOBBY_GENERAL, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyGeneralController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.LOBBY_ACCOUNCEMENT, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyAnnouncementController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.LOBBY_ACCOUNT, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyAccountController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.LOBBY_CAREER, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyCareerController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.LOBBY_SHOP, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyShopController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.CLUB_ADMIN, (data) => {
                data.data.no = memberList[wsId];
                this.clubAdminController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.CLUB_COUNTER, (data) => {
                data.data.no = memberList[wsId];
                this.clubCounterController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.CLUB_DATA, (data) => {
                data.data.no = memberList[wsId];
                this.clubDataController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.CLUB_EMAIL, (data) => {
                data.data.no = memberList[wsId];
                this.clubEmailController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.CLUB_MEMBER, (data) => {
                data.data.no = memberList[wsId];
                this.clubMemberController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.LOBBY_TO_GAME, (data) => {
                data.data.no = memberList[wsId];
                this.lobbyToGameController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.GAME_NLH, (data) => {
                data.data.no = memberList[wsId];
                this.gameNLHController.on(ws, data, req.connection.remoteAddress)
                .catch((error) => {
                    _log.error(error);
                });
            });
            ws.on(SocketConstant.DISCONNECT, (code: number, reason: string): void => {
                const no = memberList[wsId];
                memberList = _.omit(memberList, wsId);
                console.log('disconnect memberList 「', memberList, '」', Object.keys(memberList).length);
                memberSocket.disconnect(no, wsId);
                this.lobbyDisconnectController.on(no, wsId).catch((error) => {
                    _log.error(error);
                });
                _log.info(SocketConstant.DISCONNECT,
                    req.connection.remoteAddress + ' code : ' + code + ', reason : ' + reason);
            });
            ws.on(SocketConstant.ERROR, (err: Error) => {
                _log.error(SocketConstant.ERROR, req.connection.remoteAddress + ', error : ' + err);
            });
        });
        WebSocketContext.getInstance().getWebsocket().setMiddleware(SocketConstant.ON_CHANNEL_OPEN, (channel) => {
            // channel: name of the channel
        });
        WebSocketContext.getInstance().getWebsocket().setMiddleware(SocketConstant.ON_CHANNEL_CLOSE, (channel) => {
            // channel: name of the channel
        });
        WebSocketContext.getInstance().getWebsocket().setMiddleware(
            SocketConstant.ON_PUBLISH, (channel: string, data: any): void => {
            _log.info(SocketConstant.ON_PUBLISH, data);
            this.publishController.on(channel, data);
        });
        WebSocketContext.getInstance().getWebsocket().setWatcher(SocketConstant.JOIN, (data) => {
            this.publishController.join(data);
        });
    }
}
interface IWS {
    on: (event: SocketConstant, data: (adata?: any, tdata?: any) => void) => {};
}
