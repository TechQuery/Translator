'use strict';

const Translator = require('../source/'),
      Config = require('../source/config.json');

console.log = function () {/* fix Babel bug in Chromy */};

const test_text = ['Hello, Google!',  'Bye, GFW!'];


(async function () {

    for (let engine  of  Object.keys( Config )) {

        console.info(`
            >>> ${engine} <<<
        `);

        let start = Date.now(),
            translator = await (new Translator( engine )).boot();

        console.info(`[Boot - ${(Date.now() - start) / 1000}s]\n`);

        console.dir(await translator.batch(test_text,  function (text, seconds) {

            console.info(`[Submit - ${seconds}s]  ${text}\n`);
        }));

        await translator.destroy();
    }
})();
