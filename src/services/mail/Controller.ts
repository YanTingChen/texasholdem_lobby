import { all, controller, cookies,
    httpDelete, httpGet, httpHead, httpMethod, httpPatch,
    httpPost, httpPut, next, queryParam,
    request, requestBody, requestHeaders, requestParam, response, TYPE } from 'inversify-koa-utils';
import { inject, provideNamed } from '../../ioc/ioc';
import BaseController from '../../models/BaseController';
import BaseResponse from '../../models/BaseResponse';
import IContext from '../../models/IContext';
import BaseUtils from '../../utils/BaseUtils';
import Utils from '../../utils/Utils';
import Service from './Service';
@provideNamed(TYPE.Controller, 'MailController')
@controller('/mail')
export default class MailController extends BaseController {
    constructor(
        @inject('MailServer') private service: Service) { super(); }

    // 寄送 mail
    @httpPost('/')
    public async mail(ctx: IContext) {
        const playerMail = ctx.request.body.reqData.mail;
        ctx.body = new BaseResponse(await this.service.sendMail(playerMail));
    }

    // 修改信箱
    @httpPost('/modifyemail')
    public async modifyEmail(ctx: IContext) {
        const id = ctx.request.body.reqData.id; // 會員序號
        // const member = ctx.state.user as any;
        // const id = Utils.Decryption_AES_ECB_128(member.id); // 會員序號
        console.log(' ctx ',  ctx);
        const email = ctx.request.body.reqData.email; // 會員信箱
        const verificationCode = ctx.request.body.reqData.verificationCode; // 信箱驗證碼
        const password = ctx.request.body.reqData.password; // 密碼
        ctx.body = new BaseResponse(await this.service.modifyEmail(id, email, verificationCode, password));
    }

    // 大廳信箱
    @httpPost('/lobbymail')
    public async lobbymail(ctx: IContext) {
        ctx.body = new BaseResponse({});
    }

    // 俱樂部信箱
    @httpPost('/clubmail')
    public async clubmail(ctx: IContext) {
        ctx.body = new BaseResponse({});
    }
}
