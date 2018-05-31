const hello = require('./hello');
const assert = require('assert');
describe('helloAsync-test.js', function () {
    it('expression should return 15', async () => {
        let r = await hello.readFile();
        assert.equal(r, 15);
    });
})