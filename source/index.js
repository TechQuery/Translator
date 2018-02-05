'use strict';

const Chromy = require('chromy'),
      Utility = require('./utility'),
      Config = require('./config.json');


class Translator {

    constructor(engine = 'Google') {

        this.engine = Config[ engine ];

        this.client = new Chromy({visible:  Boolean( process.env.NPM_DEBUG )});
    }

    destroy() {

        return this.client.close();
    }

    async boot() {

        await this.client.goto( this.engine.URL );

        await this.client.wait( this.engine.input );

        return this;
    }

    get target() {

        return  this.client.evaluate(function (output) {

            return  document.querySelector( output ).lang;

        },  [this.engine.output]);
    }

    get phonogram() {

        return  this.engine.phonogram  &&  this.client.evaluate(
            Utility.getOutput,  [ this.engine.phonogram ]
        );
    }

    get loaded() {

        return this.client.evaluate(
            Utility.getOutput,  [this.engine.phonogram || this.engine.output]
        ).then(function (text) {

            return  (!! text);
        });
    }

    async submit(text = '') {

        await this.client.type(this.engine.input, text);

        await this.client.click( this.engine.submit );

        for (let i = 0;  i < 19;  i++)
            if (await this.loaded)
                return  this.client.evaluate(Utility.getOutput,  [ this.engine.output ]);

        throw Error('Timeout');
    }

    async reset() {

        await this.client.evaluate(function (input, reset) {

            input = document.querySelector( input );

            if ( input.form )
                input.form.reset();
            else
                document.querySelector( reset ).click();

        },  [this.engine.input, this.engine.reset]);

        while (await this.loaded)  ;
    }

    async batch(list = [ ],  forEach) {

        const _this_ = this, result = [ ];

        forEach = (forEach instanceof Function)  &&  forEach;

        await Utility.toQueue(list.map(function (text) {

            return  async function () {

                const start = Date.now();

                result.push(text = await _this_.submit( text ));

                if ( forEach )  forEach(text,  (Date.now() - start) / 1000);

                await _this_.reset();
            };
        }));

        return result;
    }
}

module.exports = Translator;
