const isName = token => /^[#$&+*<>=?a-zA-Z\-\_\/]*$/.test(token);

const isParen = token => token === '(' || token === ')';

const isNumber = token => token.toString().trim() !== '' && !isNaN(Number(token));

const isQuote = token => token === "'";


const typeOf = token => [
  [isName, 'name'],
  [isParen, 'paren'],
  [isNumber, 'number'],
  [isQuote, 'quote'],
  [_ => true, 'INVALID TYPE']
].filter(type => type[0](token))[0][1];

function tokenize(str) {
  let tokens = [];
  for (let s of str.split(/\s+/)) {
    while (s !== '') { 
      let type = typeOf(s[0]);
      let i = 1;
      while(typeOf(s.slice(0, i+1)) === type) {
        if (i >= s.length) {
          break;
        }
        i++;
      }
      
      tokens.push(s.slice(0,i));
      s = s.slice(i);
    }
  }
  return tokens;
}

module.exports = {
  isName,
  isParen,
  isNumber,
  // isSymbol,
  typeOf,
  tokenize
};
