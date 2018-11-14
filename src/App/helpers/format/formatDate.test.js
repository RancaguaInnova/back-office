import formatDate from './formatDate'

const date = new Date()

it('Should format a date object according to passed params or a default', () => {
  expect(formatDate(date)).stringMatching(/^[0-3][0-9]-[0-1][0-2]-20[1-9][8-9]$/)
})
