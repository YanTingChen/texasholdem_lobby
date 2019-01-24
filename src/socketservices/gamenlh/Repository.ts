import * as _ from 'lodash';
import 'reflect-metadata';
import { ClubRedis } from '../../config/ClubRedis';
import { Backend } from '../../config/enum.backend';
import { Constant } from '../../config/enum.constant';
import { GameRedis } from '../../config/GameRedis';
import { provide } from '../../ioc/ioc';
import BaseRepository from '../../models/BaseRepository';

@provide('GameNLHRepository')
export default class GameNLHRepository extends BaseRepository {
    constructor() {
        super();
    }

    public async sendGameInit(no, clubNo, bet, isInsurance, isMultdeal, isJackpot, cost): Promise<any> {
        const data = {
            c: 55,
            d: {
                no,
                clubNo,
                bet,
                insurance: isInsurance,
                more: isMultdeal,
                jackpot: isJackpot,
                cost
            }
        };
        const res = await this.apiManager.httpPost(Backend.LINK, data, {Connection: 'close'});
        return res.body;
    }

    public async  updateDiamond(no, diamond): Promise<any> {
        return this.redisManger.hmset(GameRedis.HASH_PLAYERINFO + no, 'diamond', diamond);
    }

    public async insertRule(club, owner, seat, sec, sb, bb, min_bet, max_bet, ante, auto_start, start_people,
        straddle, multdeal, insurance, rake, top_rake, buyin, gps, ip, game_time): Promise<any> {
            // const aaaa =  await this.sqlManager.callSP('CALL insert_club_session(?, ?)', [456, '2015-05-06']);
            // const aaaa =  await this.sqlManager.getSessionId(234);
        const res = await this.sqlManager.callSP
        ('CALL insert_nlh_rule(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [club, owner, seat, sec, sb, bb, min_bet, max_bet, ante, auto_start, start_people, straddle, multdeal,
            insurance, rake, top_rake, buyin, gps, ip, game_time]);
        if (res === undefined || res === 'undefined') {
            return -1;
        }
        return _.toNumber(res[0].id);
    }

    public async startGame(club: number, game_mode: number, rule: number, game_time: Date,
        owner: number, name: string, seat: number, sb: number, bb: number, insurance: number,
        multdeal: number, jackpot: number): Promise<any> {
        const res =  await this.sqlManager.callSP
        ('CALL insert_club_game(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [club, game_mode, rule, game_time, owner, name, seat, sb, bb, insurance, multdeal, jackpot, 1]);
        if (res === undefined || res === 'undefined') {
            return -1;
        }
        return _.toNumber(res[0].id);
    }

    public async startSession(game: number) {
        const res =  await this.sqlManager.callSP
        ('CALL insert_club_session(?)', [game]);
        if (res === undefined || res === 'undefined') {
            return -1;
        }
        return _.toNumber(res[0].id);
    }

    public async selectTableType(game_mode: number) {
        const data = {
            id: game_mode
        };
        const res =  await this.sqlManager.callSP('CALL select_table_type(?)', [JSON.stringify(data)]);
        const type = res[0].table_name + res[0].game_name + res[0].mode_name;
        return type;
    }

    public async initDeskSeat(
        club, // 俱樂部
        session,  // 局號
        type, // 牌桌類型
        name,
        seat, // 玩家人數
        channelName, // 桌號
        sec,   // 思考時間
        min_bet,   // 最高吸入
        max_bet,   // 最高吸入
        ante, // 前注
        auto_start,
        smallBlind, // 小盲
        bb,     // 大盲
        owner, // 開桌玩家
        multdeal, // 多排開關
        insurance, // 保險開關
        straddle, // 搶大盲
        rake, // 服務費
        top_rake,  // 收的費用最高
        buyin, // 授權買入
        gps,   // GPS限制
        ip,    // IP限制
        game_time, // 總時長
        clubListKey, // game:desk:list:tableList
        game,
        startPeople
        ): Promise<any> {
        const initOnePlays: number[] = _.fill(Array(seat), -1);
        const init100Plays: number[] = _.fill(Array(seat), 100);
        const pipeline = this.redisManger.pipeline();
        return pipeline
            // 清除
            .del(GameRedis.HASH_DESKINFO + channelName,
                GameRedis.LIST_PLAYER_SIT + channelName,
                GameRedis.LIST_PLAYING_PLAYER + channelName,
                GameRedis.HASH_LOOK_PLAYER + channelName,
                GameRedis.LIST_PLAYER_POINT + channelName,
                GameRedis.LIST_PLAYER_ACTION + channelName,
                GameRedis.LIST_ONLINE_PLAYER + channelName)
            // 開始重置
            .hmset(GameRedis.HASH_DESKINFO + channelName, {
                session,
                owner,
                deskStatus: 0, // 牌桌是否已開始
                channelName, // 頻道名稱
                deskPeople: 0, // 目前玩家數量
                seatSpace: seat,  // 位置空間
                nowPlayer: -1, // 目前要決定動作的玩家
                deskMin: min_bet,
                deskMax: max_bet,
                ante, // 前注
                dHost: -1, // 莊家
                dSmall: -1, // 小忙
                dBig: -1, // 大忙
                dSmallCost: smallBlind, // 小忙
                dBigCost: bb, // 大忙注金額
                deskMoney: 0, // 目前押注金額
                frontMoney: bb,
                round: 0,	// 目前倫數
                castTime: 0, // 本局耗時
                game_time, // 本桌總可用時間
                countDown: sec, // 倒數計時
                countDowner: 0, // 倒數計時的人啟動了沒
                masterCountDowner: auto_start, // 場主模式
                beforeGamePlayer: 0, // 上一局玩家人數
                straddle, // 搶大盲
                insurance, // 保險
                multdeal,   // 多牌
                authorizedBuy: buyin, // 授權買入(前端給我資料)
                waterMoney: rake, // 水錢
                topRake: top_rake, // 最高水錢
                gps,    // gps 檢測
                ip, // IP 檢測
                club, // 俱樂部
                game,
                name, // 俱樂部名稱
                startPeople,
                type // 牌桌類型
            })
            .hset(GameRedis.HASH_LOOK_PLAYER + channelName, owner, Constant.PLAYER_LOOK)
            .rpush(GameRedis.LIST_PLAYER_SIT + channelName, ...initOnePlays)
            .rpush(GameRedis.LIST_PLAYING_PLAYER + channelName, ...initOnePlays)
            .rpush(GameRedis.LIST_PLAYER_POINT + channelName, ...initOnePlays)
            .rpush(GameRedis.LIST_PLAYER_ACTION + channelName, ...init100Plays)
            .rpush(GameRedis.LIST_ONLINE_PLAYER + channelName, 0)
            .rpush(clubListKey, channelName)
            .rpush(GameRedis.DESK_PLAYING, channelName)
            .expire(GameRedis.HASH_DESKINFO, game_time * 60 * 60 * 1000)
            .exec();
    }
    public async initPlayer(
        session,
        channelName,
        redisPlayerKey): Promise<any> {
        const pipeline = this.redisManger.pipeline();
        return pipeline
            .hmset(redisPlayerKey, {
                sessionRecordID: session,
                channelName,
                action: Constant.STATUS_LOOK
            })
            .exec();
    }
}
