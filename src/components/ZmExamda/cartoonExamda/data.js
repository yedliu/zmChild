export const matchData = '{"top":[{"id":1031,"subQuestionId":645250,"content":"ff","type":"text","showOrder":0,"pos":"top","x":465,"y":59,"active":true,"curLinePos":0},{"id":1033,"subQuestionId":645251,"content":"zz","type":"text","showOrder":1,"pos":"top","x":465,"y":137,"active":true,"curLinePos":1}],"bottom":[{"id":1034,"subQuestionId":645251,"content":"zz","type":"text","showOrder":0,"pos":"bottom","x":485,"y":59,"active":true,"curLinePos":1},{"id":1032,"subQuestionId":645250,"content":"ff","type":"text","showOrder":1,"pos":"bottom","x":485,"y":137,"active":true,"curLinePos":0}],"matchList":[[{"id":1031,"subQuestionId":645250,"content":"ff","type":"text","showOrder":0,"pos":"top","x":465,"y":59,"active":true,"curLinePos":0},{"id":1032,"subQuestionId":645250,"content":"ff","type":"text","showOrder":1,"pos":"bottom","x":485,"y":137,"active":true,"curLinePos":0}],[{"id":1033,"subQuestionId":645251,"content":"zz","type":"text","showOrder":1,"pos":"top","x":465,"y":137,"active":true,"curLinePos":1},{"id":1034,"subQuestionId":645251,"content":"zz","type":"text","showOrder":0,"pos":"bottom","x":485,"y":59,"active":true,"curLinePos":1}]]}'

export function compare(name) {
  return function (a, b) {
    const value1 = a[name]
    const value2 = b[name]
    return value1 - value2
  }
}
