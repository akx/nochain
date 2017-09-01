const {splitMaxCount} = require('../lib/util');

describe('splitMaxCount', () => {
  it(
    'handles less delimiters than splits correctly',
    () => expect(splitMaxCount('foo.bar.baz', '.', 3)).toEqual(['foo', 'bar', 'baz'])
  );
  it(
    'splits things correctly',
    () => expect(splitMaxCount('foo.bar.baz.quux.snarl', '.', 3)).toEqual(['foo', 'bar', 'baz', 'quux.snarl'])
  );
});
