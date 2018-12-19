//TODO: implement a Show-like interface for lisp primitives such as nil,
//  <Procedure#>, error vals

const types = require('./parseToken.js');
const chalk = require('chalk');

function show(val) {
  if (Array.isArray(val)) {
    //if (val.toString !== Array.prototype.toString) {
      //console.log('has custom show');
      //return chalk.yellow(val.toString(show));
    //} else {
      return chalk.yellow(`(${val.map(show).join(' ')})`);
    //}
  } else if (typeof val === 'function') {
    return chalk.blue('<Procedure>');
  } else if (typeof val === 'object') {
    // Object represents an error
    if (val.isError) return chalk.red(val.toString());
  } else {
    if (val === undefined) return chalk.grey('undefined');
    return chalk.yellow(val.toString());
  }
}

module.exports = { show };

