const chalk = require('chalk');
const repl = require('repl');

const { typeOf, tokenize } = require('./parseToken.js');
const { generateExpressions } = require ('./AST.js');
//TODO: Fix it so that inputStream errors on extraneous input

const { evaluate } = require('./evaluation.js');
const { show } = require('./showImplement.js');


//https://nodejs.org/api/repl.html#repl_custom_evaluation_functions
function replEval(cmd, context, filename, callback) {
  //console.log(cmd);
  const exprs = cmd.trim();

  let results;
  try {
    // For each expression, store its resulting value in an array 
    results = generateExpressions(exprs).map(expr => evaluate(expr));
  } catch (error) {
    if (error.name === 'SyntaxError') {
      if (/^(Unexpected end of input|Unexpected token)/
        .test(error.message)) {
        return callback(new repl.Recoverable(error));
      }
    } else {
      callback (error);
    }
  }
  callback(null, results);
}

const replConfig = {
  prompt: 'λ ',
  eval: replEval,
  writer: results => {
    return results.map(show).join('\n');
  },
  ignoreUndefined: true
}

function main() {
  console.log('Welcome to an incomplete Racket interpreter.');
  const r = repl.start(replConfig);
}

main();
