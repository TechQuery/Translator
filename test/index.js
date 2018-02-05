'use strict';

const Translator = require('../source/'),
      Utility = require('../source/utility'),
      Config = require('../source/config.json');

console.log = function () {/* fix Babel bug in Chromy */};

const test_text = ['Hello, Google!',  'Bye, GFW!'];


Utility.toQueue(Object.keys( Config ).map(function (engine) {

    return  async function () {

        console.info(`
            >>> ${engine} <<<
        `);

        const translator = await (new Translator( engine )).boot();

        console.dir(await translator.batch(test_text,  function (text, seconds) {

            console.info(`[ ${seconds}s ]  ${text}`);
        }));

        await translator.destroy();
    };
}));
