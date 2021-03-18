import { extractHashtags } from '../src/utils';
import { Logger } from '../src/utils/log';

Logger.setLevel('error');

describe('hashtag extraction', () => {
  it('works with simple strings', () => {
    expect(extractHashtags('hello #world on #this planet')).toEqual(
      new Set(['world', 'this'])
    );
  });
  it('works with tags at beginning or end of text', () => {
    expect(extractHashtags('#hello world on this #planet')).toEqual(
      new Set(['hello', 'planet'])
    );
  });
  it('supports _ and -', () => {
    expect(extractHashtags('#hello-world on #this_planet')).toEqual(
      new Set(['hello-world', 'this_planet'])
    );
  });
  it('ignores tags that only have numbers in text', () => {
    expect(
      extractHashtags('this #123 tag should be ignore, but not #123four')
    ).toEqual(new Set(['123four']));
  });

  it('ignores hashes in plain text urls and links', () => {
    expect(
      extractHashtags(`
        test text with url https://site.com/#section1 https://site.com/home#section2 and
        https://site.com/home/#section3a
        [link](https://site.com/#section4) with [link2](https://site.com/home#section5) #control
        hello world
      `)
    ).toEqual(new Set(['control']));
  });

  it('ignores hashes in links to sections', () => {
    expect(
      extractHashtags(`
      this is a wikilink to [[#section1]] in the file and a [[link#section2]] in another
      this is a [link](#section3) to a section
      `)
    ).toEqual(new Set());
  });
});
