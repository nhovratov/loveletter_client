'use strict';
const fs = require('fs');

module.exports = {
    generateFaIconCss: () => {
        return new Promise((resolve) => {
            delete require.cache[require.resolve('./src/scss/_fa-icons.json')];
            let usedIcons = require('./src/scss/_fa-icons.json');
            let css = '';
            for (let i = 0; i < usedIcons.length; i++) {
                let icon = usedIcons[i];
                css += `.fa-${icon}:before{content:fa-content($fa-var-${icon});}`;
            }

            fs.writeFile('./src/scss/_fa-icons.scss', css, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            resolve();
        });
    },

    /**
     * Take a list of webpack compilers and returns a promise that
     * resolves when all of them finished executing the .run() command.
     *
     * @param {Array} compilers
     * @returns {Promise}
     */
    compileWebpack: (compilers) => {
        return new Promise(resolve => {
            let runningCompilers = compilers.length;
            compilers.forEach(compiler => {
                compiler.run(() => {
                    runningCompilers--;
                    if (runningCompilers === 0) {
                        resolve();
                    }
                });
            })
        });
    }
};
