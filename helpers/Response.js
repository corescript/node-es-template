class Response {
    constructor(res, options) {
        this.res = res;
        this.lang = options?.lang || 'en';
        this.success = false;
        this.data = options?.data || undefined;
        this.meta = options?.meta || undefined;
        this.type = options?.type || 'UnknownError';
        this.error = options?.error;
        this.fieldErrors = options?.fieldErrors || undefined;

        this.constants = require(`data/lang/constants.${this.lang}.json`);
    }

    getMessageDetals(type) {
        return this.constants[type] || this.constants['UnknownError'];
    }

    populateFieldErrors(errors) {
        return errors.reduce((acc, error) => {
            let message = this.constants[error.msg]?.message || error.msg;
            if (acc[error.param]) {
                acc[error.param] = [...acc[error.param], message];
                return acc;
            }
            acc = { ...acc, [error.param]: [message] };
            return acc;
        }, {});
    }

    getError() {        
        switch (this.error.name) {
            case 'ValidationError':
                return this.constants[this.error.errors?.name?.message];
            default:
                return null;
        }
    }

    send() {
        let resBody = {
            status: 400,
        };

        let metaData = undefined;

        if (this.error) {
            metaData = this.getError();
        } else if (this.type) {
            metaData = this.getMessageDetals(this.type);
        }

        if (metaData) {
            let { type, message, status } = metaData;
            resBody.status = status;
            metaData.type = type;
            metaData.message = message;
        } else {
            let { type, message, status } = this.getMessageDetals(
                'UnknownError'
            );
            resBody.status = status;
            metaData = { type, message };
        }

        if (resBody.status === 200) {
            resBody.success = true;
            resBody.data = this.data || {};
            resBody.meta = {
                ...this.meta,
                type: metaData.type,
                message: metaData.message,
            };
            // if (this.meta) {
            //     response.meta = {
            //         moreData: isMoreData,
            //         items: data.length,
            //         totalItems: totalItems,
            //     };
            // }
        } else {
            if (this.fieldErrors) {
                resBody.errors = this.populateFieldErrors(this.fieldErrors);
            }
            resBody.success = false;
            resBody.result = this.data;
            resBody.meta = {
                ...this.meta,
                type: metaData.type,
                message: metaData.message,
            };
        }

        if (process.env.NODE_ENV === 'dev' && this.error) {
            console.error(this.error);
        }
        
        this.res.status(resBody.status).send(resBody);
    }
}

module.exports = Response;
