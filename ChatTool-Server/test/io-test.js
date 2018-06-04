const io = require('../controller/io');
const assert = require('assert');

describe("io-test", function () {
  it('sum() should return 0', () => {
    assert.equal(io(), 10);
  });
})