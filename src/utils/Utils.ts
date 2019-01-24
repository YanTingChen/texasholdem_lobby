import * as fastJson from 'fast-json-stringify';
import * as _ from 'lodash';
import { Constant } from '../config/enum.constant';
import { ErrorStatusCode } from '../config/enum.http';
import BaseEntity from '../models/BaseEntity';
import Exceptions from '../models/Exceptions';
import Success from '../models/Success';
import BaseUtils from './BaseUtils';

export default class Utils extends BaseUtils {
    public static modifyHistoryLog(
        logType: Constant.MS_MODIFY_HISORY_LOG_TYPE_ADD | Constant.MS_MODIFY_HISORY_LOG_TYPE_MODIFY,
        title: string, obj: BaseEntity | object) {
        const titleString = logType === Constant.MS_MODIFY_HISORY_LOG_TYPE_ADD ? title + ':Add' : title + ':Modify';
        const toObj = (obj instanceof BaseEntity) ? obj.toJSON() : obj;
        let objString: string = titleString;
        _.mapKeys(toObj, (v, k) => {
            objString += ', ' + _.toString(k) + ':' + _.toString(v);
            return {};
        });
        return objString;
    }
    public static resultWarn(msg: string, statusCode: ErrorStatusCode = ErrorStatusCode.PORCEDURE_WARN) {
        throw new Exceptions(statusCode, msg);
    }
    public static resultSuccess(msg: string, statusCode: ErrorStatusCode = ErrorStatusCode.STATUS_OK) {
        return new Success(statusCode, msg);
    }
    public static resultWarns(iResult: number | string, ...exceptionsList: Array<{
        ResultCode: number,
        Msg: any,
        Success: boolean,
        StatusCode?: ErrorStatusCode | any
    }>) {
        const index = _.findIndex(exceptionsList, (find) => {
            return find.ResultCode === iResult;
        });
        if (index === -1) {
            throw new Exceptions(ErrorStatusCode.STATUS_FAIL, 'Undefined Error');
        }
        const exception = exceptionsList[index];
        if (exception.Success) {
            return this.resultSuccess(exception.Msg, exception.StatusCode);
        } else {
            return this.resultWarn(exception.Msg, exception.StatusCode);
        }
    }
    public static Warn(
        iResultCode: number | string,
        sMsg: string,
        statusCode: ErrorStatusCode = ErrorStatusCode.PORCEDURE_WARN) {
        return _.omitBy({
            ResultCode: iResultCode,
            Msg: sMsg,
            StatusCode: statusCode,
            Success: false
        }, _.isUndefined) as {
                ResultCode: number,
                Msg: string,
                Success: boolean,
                StatusCode?: ErrorStatusCode
            };
    }
    public static Success(
        iResultCode: number | string,
        sMsg: string,
        statusCode: ErrorStatusCode = ErrorStatusCode.STATUS_OK) {
        return _.omitBy({
            ResultCode: iResultCode,
            Msg: sMsg,
            StatusCode: statusCode,
            Success: true
        }, _.isUndefined) as {
                ResultCode: number,
                Msg: string,
                Success: boolean,
                StatusCode?: ErrorStatusCode
            };
    }
    public static findElementByIndex(list: any[], index: number) {
        const _index = index % list.length;
        return list[_index];
    }
    public static findBarrel(id: number) {
        return (id % 200);
    }
    private static stringify = fastJson({
        title: 'Example Schema',
        type: 'object',
        properties: {
          um_id: {
            type: 'string'
          },
          pr_sessionRecordID: {
            type: 'string'
          },
          pr_roundStatusID: {
            type: 'string'
          },
          pr_handsAmount: {
            type: 'string'
          },
          pr_seat: {
            type: 'string'
          },
          pr_hands: {
            type: 'string'
          },
          pr_castTime: {
            type: 'string'
          },
          pr_bet: {
            type: 'string'
          },
          pr_action: {
            type: 'string'
          },
          pr_deskBetPool: {
            type: 'string'
          },
          pr_insurance: {
            type: 'string'
          }
        }
    });
    public static testFastJson(obj: any) {
        return Utils.stringify(obj);
    }

}
