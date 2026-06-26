process.env.EDGE_BIN = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-edge-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: { jasmine: { random: true } },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/petshop-frontend'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['EdgeHeadless'],
    customLaunchers: {
      EdgeHeadless: {
        base: 'Edge',
        flags: ['--headless', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9223']
      }
    },
    restartOnFileChange: true
  });
};
