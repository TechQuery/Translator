# Translator

Free translator NPM package based on **headless Web browser**

[![NPM Dependency](https://david-dm.org/TechQuery/free-translator.svg)](https://david-dm.org/TechQuery/free-translator)

[![NPM](https://nodei.co/npm/free-translator.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/free-translator/)



## Support

[Translate platform](source/config.json)



## Example

```JavaScript
'use strict';

const Translator = require('translator');


(async function () {

    const translator = await (new Translator()).boot();

    console.dir(await translator.batch(
        ['Hello, Google!',  'Bye, GFW!'],  function (text, seconds) {

            console.log(`[ ${seconds}s ]  ${text}`);
        }
    ));

    await translator.destroy();
})();
```
