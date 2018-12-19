const { generateAST } = require('./AST.js');

test("Test quote `'hello` without surrounding parens", () => {
  expect(generateAST(" 'hello ")).toEqual(['quote', 'hello']);
});

test("Test quote with surrounding parens", () => {
  expect(generateAST(" ('hello) ")).toEqual([ ['quote', 'hello'] ]);
});

test("Test quote on list", () => {
  expect(generateAST(" '(hello) ")).toEqual(['quote', ['hello'] ]);
});
