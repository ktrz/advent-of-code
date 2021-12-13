import {
  arrowFunctionExpression,
  blockStatement,
  callExpression,
  exportNamedDeclaration,
  expressionStatement,
  identifier,
  importDeclaration,
  importSpecifier,
  memberExpression,
  program,
  returnStatement,
  stringLiteral,
  templateElement,
  templateLiteral,
  tSStringKeyword,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'

export const createInputFileAst = (data: string) =>
  exportNamedDeclaration(
    variableDeclaration('const', [
      variableDeclarator(
        identifier('input'),
        templateLiteral(
          [
            templateElement({
              raw: `\n${data.trim()}\n`,
            }),
          ],
          [],
        ),
      ),
    ]),
  )

export const createSolutionFileAst = () =>
  program([
    importDeclaration(
      [importSpecifier(identifier('input'), identifier('input'))],
      stringLiteral('./input1'),
    ),
    variableDeclaration('const', [
      variableDeclarator(
        identifier('solution'),
        arrowFunctionExpression(
          [
            {
              ...identifier('inputValue'),
              typeAnnotation: tsTypeAnnotation(tSStringKeyword()),
            },
          ],
          blockStatement([returnStatement(identifier('inputValue'))]),
        ),
      ),
    ]),
    expressionStatement(
      callExpression(
        memberExpression(identifier('console'), identifier('log')),
        [callExpression(identifier('solution'), [identifier('input')])],
      ),
    ),
  ])
