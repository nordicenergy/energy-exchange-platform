var lab = exports.lab = require('lab').script();
var expect = require('code').expect;
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;

var main = require('../lib/main');


var vector = 'CVSS:3.0/AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:H/E:H/RL:U/RC:C/CR:H/IR:H/AR:H/MAV:N/MAC:L/MPR:N/MUI:N/MS:C/MC:H/MI:H/MA:H';

describe('issue #2', function () {
  it('environmental score should be 10', function () {
    expect(main.getEnvironmentalScore(vector)).to.equal(10.0)
  });
});
