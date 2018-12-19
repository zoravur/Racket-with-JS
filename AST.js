const { tokenize } = require('./parseToken.js');

function generateQuote(tokens) {
  return ['quote', generateAtom(tokens)];
}

function generateSExpr(tokens) {
  if (tokens.length === 0) throw SyntaxError('Unexpected end of input');
  let token = tokens[0];

  if (token === ')') {
    tokens.shift();
    return []; // base case
  } else {
    // value that begins with the first token in tokens.
    let value = generateAtom(tokens);
    let fullValue = generateSExpr(tokens);
    fullValue.unshift(value);
    
    return fullValue;
  }
}
    

function generateAtom(tokens) {
  let token = tokens[0];
  tokens.shift();

  if (token === ')') {
    throw Error('Unexpected token: )');
  } else if (token === '(') {
    return generateSExpr(tokens);
  } else if (token === "'") {
    return generateQuote(tokens);
  } else {
    return token;
  }
}

function generateAST(str) {
  return generateAtom(tokenize(str));
}

function generateExpressions(str) {
  let tokens = tokenize(str);
  let exprs = [];
  while (tokens.length !== 0) {
    exprs.push(generateAtom(tokens));
  }
  return exprs;
}

module.exports = {
  genSyntax: generateAtom, // For backwards things
  generateAST,
  generateExpressions
};

