# Translator

Free translator NPM package based on **headless Web browser**, inspired by [fcc_trad](https://github.com/vtamara/fcc_trad)

[![NPM Dependency](https://david-dm.org/TechQuery/Translator.svg)](https://david-dm.org/TechQuery/Translator)

[![NPM](https://nodei.co/npm/free-translator.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/free-translator/)



## Support

[Translate platform](source/config.json)



## Dependency

[Google® Chrome™](https://www.google.com/chrome/) 60+



## Example

```JavaScript
'use strict';

const Translator = require('free-translator');

console.log = function () {/* fix Babel bug in Chromy */};


(async function () {

    const start = Date.now(),
          translator = await (new Translator()).boot();

    console.info(`[Boot - ${(Date.now() - start) / 1000}s]\n`);

    console.dir(await translator.batch(
        ['Hello, Google!',  'Bye, GFW!'],  function (text, seconds) {

            console.info(`[Submit - ${seconds}s]  ${text}\n`);
        }
    ));

    await translator.destroy();
})();
```
