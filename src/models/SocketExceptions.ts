import * as _ from 'lodash';

export default class SocketExceptions {
    public status: boolean;
    public error_codes: number;
    public message: any;
    constructor(_code, _message) {
        this.status = false;
        this.error_codes = _code;
        this.message = _message;
    }
}
