import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import 'reflect-metadata';
import { GameRedis } from '../../config/GameRedis';
import { inject, provide } from '../../ioc/ioc';
import BaseService from '../../models/BaseService';
import Exceptions from '../../models/Exceptions';
import SocketExceptions from '../../models/SocketExceptions';
import Repository from './Repository';

@provide('GameNLHServer')
export default class GameNLHServer extends BaseService {
    constructor(@inject('GameNLHRepository') private repository: Repository) {
        super();
    }
    public async startGame(data: any): Promise<any> {
        const time = await this.repository.getDBCurrentTime();
        const sb = _.toNumber(_.split(data.bb, ',')[0]);
        const bb = _.toNumber(_.split(data.bb, ',')[1]);

        // 還沒作例外處理

        // 開局花費 檢查鑽石存量
        const checkDiamandResult = await this.repository.sendGameInit(data.no, data.club,  data.bb,
            data.insurance, data.multdeal, data.jackpot, data.cost);
        if (checkDiamandResult.s) {
            if (checkDiamandResult.d.diamond) {
                await this.repository.updateDiamond(data.no, _.toNumber(checkDiamandResult.d.diamond));
            }
        } else {
            throw new SocketExceptions(checkDiamandResult.e, 'startGame error !!');
        }
        // if (checkDiamandResult === -1) {
        //     throw new Exceptions(7161, 'insufficient in diamand');
        // } else if (checkDiamandResult <= 5) {
        //     throw new Exceptions(7161, 'insufficient in diamand');
        // }

        // 新增規則
        const rule = await this.repository.insertRule(data.club, data.no, data.seat, data.sec,
            sb, bb, data.min_bet,
            data.max_bet, data.ante, data.auto_start, data.start_people, data.straddle, data.multdeal,
            data.insurance, data.rake, data.top_rake, data.buyin, data.gps, data.ip, data.game_time);
        if (rule === -1) {
            throw new Exceptions(8011, 'transaction fails');
        }
        // 開桌 取得桌號
        const game = await this.repository.startGame(data.club, data.game_mode, rule, data.game_time,
            data.no, data.name, data.seat, sb, bb, data.insurance, data.multdeal, data.jackpot);
        if (game === -1) {
            throw new Exceptions(8011, 'transaction fails');
        }
        // 開 session
        const session = await this.repository.startSession(game);
        if (session === -1) {
            throw new Exceptions(8011, 'transaction fails');
        }
        const type = await this.repository.selectTableType(data.game_mode);
        const channelName = type + _.toString(game);
        const _bb = _.toString(bb);
        const _sb = _.toString(sb);
        const redisPlayerKey = GameRedis.HASH_PLAYERINFO + data.no;
        const clubListKey = GameRedis.LIST_CLUB_LIST + data.club;
        await Promise.all([
            this.repository.initDeskSeat(
                data.club, // 俱樂部
                session,  // 局號
                data.game_mode, // 牌桌類型
                data.name, // 牌桌名稱
                data.seat, // 玩家人數
                channelName, // 桌號
                data.sec,   // 思考時間
                data.min_bet,   // 最高吸入
                data.max_bet,   // 最高吸入
                data.ante, // 前注
                data.auto_start, // 自動開始
                _sb,
                _bb,    // 大盲
                data.no, // 開桌玩家
                data.multdeal, // 多牌開關
                data.insurance, // 保險開關
                data.straddle, // 搶大盲開關
                data.rake, // 服務費
                data.top_rake,  // 收的費用最高
                data.buyin, // 授權買入
                data.gps,   // GPS限制
                data.ip,    // IP限制
                data.game_time, // 總時長
                clubListKey, // 俱樂部桌子
                game, // 房號
                data.start_people // 最低可開始玩家人數
            ),
            this.repository.initPlayer(
                session,
                channelName,
                redisPlayerKey
            )
        ]);
        return {
            status: true,
            tableId: type + _.toString(game),
            sessionId: session,
            owner: data.no,
            diamond: checkDiamandResult.d.diamond
        };
    }
}
