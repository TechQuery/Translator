'use strict';

const Chromy = require('chromy'), Config = require('./config.json');


class Translator {

    constructor(engine = 'Google', retryTimes = 20) {

        this.engine = Config[ engine ];

        this.client = new Chromy({visible:  Boolean( process.env.NPM_DEBUG )});

        this.retryTimes = retryTimes;

        this.result = null;
    }

    destroy() {

        return this.client.close();
    }

    async boot() {

        await this.client.goto( this.engine.URL );

        await this.client.wait( this.engine.input );

        return this;
    }

    getResult() {

        return  this.client.evaluate(function (output, phonogram) {

            const $ = document.querySelectorAll.bind( document ), result = { };

            if ( phonogram ) {

                result.phonogram = $( phonogram )[0].textContent.trim();

                if (! result.phonogram)  return;
            }

            output = $( output )[0];

            if (output  &&  (result.output = output.textContent.trim())) {

                result.language = output.lang;

                return result;
            }
        },  [this.engine.output, this.engine.phonogram]);
    }

    async reset() {

        await this.client.evaluate(function (input, reset) {

            const $ = document.querySelectorAll.bind( document );

            input = $( input )[0];

            if ( input.form )
                input.form.reset();
            else {
                input[('value' in input) ? 'value' : 'innerHTML'] = '';

                input.blur();
            }

            $( reset )[0].click();

        },  [this.engine.input, this.engine.reset]);

        await this.client.click( this.engine.submit );

        for (let i = 0;  i < this.retryTimes;  i++)
            if (! (await this.getResult()))  break;
    }

    async submit(text = '') {

        await this.client.type(this.engine.input, text);

        await this.client.click( this.engine.submit );

        for (let i = 0;  i < this.retryTimes;  i++)
            if (this.result = await this.getResult()) {

                await this.reset();

                return this.result.output;
            }

        throw Error('Submit timeout');
    }

    async batch(list = [ ],  forEach) {

        forEach = (forEach instanceof Function)  &&  forEach;

        const result = [ ];

        for (let text of list) {

            let start = Date.now();

            result.push(text = await this.submit( text ));

            if ( forEach )
                forEach.call(this,  text,  (Date.now() - start) / 1000);
        }

        return result;
    }
}

module.exports = Translator;
