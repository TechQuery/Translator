module.exports = {
    getOutput:    function (output) {

        output = document.querySelector( output );

        return  output  &&  (output.value || output.textContent).trim();
    },
    toQueue:      function (list) {

        return  list.reduce(function (promise, asyncFunction) {

            return (
                (promise instanceof Function)  ?  promise()  :  promise
            ).then( asyncFunction );
        });
    }
};
