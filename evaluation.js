let types = require('./parseToken.js');
//TODO: Create an 'evaluable' type: this means it's either an 
//  s-expression (array) or it's a name (variable)


let globalScope = {};

const specialFormList = ['define', 'lambda', 'quote', 'if'];

const evaluate = (expr, scope = globalScope) => {
  
  if (Array.isArray(expr)) {
    if (expr.length === 0) {
      throw Error('Empty s-expression');
    }

    let firstEl = expr[0];
    if (specialFormList.indexOf(expr[0]) > -1) {
      return findInScope(firstEl, scope)(expr, scope);
    }
    expr = expr.map(subexpr => evaluate(subexpr, scope));
    firstEl = expr[0];
    return firstEl(...expr.slice(1));

    //Eval in case of special form
    //Map evaluate to each arg otherwise in normal case, and then
    //call arg in fn position.
  } else if (typeof expr === 'function') {
    return expr;
  } else if (typeof expr === 'Boolean' || expr == 'true' || expr == 'false') {
    return expr === true || expr === 'true';
  }


  const type = types.typeOf(expr);
  if (type == 'name') {
    return evaluate(findInScope(expr, scope));
  } else if (type == 'number') {
    return Number(expr);
  } else if (type == 'symbol') {
    return expr;
  } else {
    throw Error('Unhandled type: ' + type + 
      '\n\t The expression was ' + expr.toString());
  }
}

const findInScope = (varName, scope) => {
  if (scope[varName] === undefined) throw Error('var name not in scope: ' + varName);
  else return scope[varName];
}

const quote = ([_, value]) => {
  // If it is evaluable, don't evaluate it
  if (Array.isArray(value) || types.typeOf(value) === 'name') {
    let result = ['quote', value];
    return result;
    /* TODO: Move the syntactic sugar for 
     * certain forms to a special file.
    result.toString = (show) => {
      return "'" + show(value);
    }
    */
  }
  // If it is atomic, just return it.
  else {
    return value;
  }
}

const define = ([_, signature, value], scope = globalScope) => {
  if (Array.isArray(signature)) {
    if (signature.length == 0) {
      throw Error('empty signature for function definition');
    }
    const name = signature[0];
    scope[name] = lambda([_, signature.slice(1), value], scope);
    //return 'defined';
  } else {
    const name = signature;
    if (!types.isName(name)) throw Error('Invalid name for define');
    scope[name] = evaluate(value, scope);

    //return 'defined';
  }
}

const lambda = ([_, params, expr], currentScope = globalScope) => {

  return function(...args) {
    let scope = Object.assign({}, currentScope);
    args.forEach((arg, i) => define(['define', params[i], arg], scope));
    return evaluate(expr, scope);
  };
};

const ifForm = ([_, condition, expr1, expr2], scope = globalScope) => {
  if (evaluate(condition, scope)) {
    return evaluate(expr1, scope);
  } else {
    return evaluate(expr2, scope);
  }
}

//Special forms
globalScope['define'] = define;
globalScope['lambda'] = lambda;
globalScope['if'] = ifForm;
globalScope['quote'] = quote;

//Builtin functions (not easily expressible as other racket functions)
globalScope['+'] = (x, y) => x + y;
globalScope['-'] = (x, y) => x - y;
globalScope['*'] = (x, y) => x * y;
globalScope['<'] = (x, y) => x < y;
globalScope['>'] = (x, y) => x > y;
globalScope['='] = (x, y) => x === y;
globalScope['>='] = (x, y) => x >= y;
globalScope['<='] = (x, y) => x <= y;
globalScope['equal?'] = 
  (x, y) => JSON.stringify(x) === JSON.stringify(y)

globalScope['cons'] = (x, y) => ['cons', x, y];
globalScope['car'] = x => x[1];
globalScope['cdr'] = x => x[2];
globalScope['nil'] = ['quote', [] ];


module.exports = {
  evaluate
}
