import cookie from '../../src/helpers/cookies'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'wuzi=buxing'
    expect(cookie.read('wuzi')).toBe('buxing')
  })

  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('uzi')).toBeNull()
  })
})
