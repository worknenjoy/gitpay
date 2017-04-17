import { MyGitPayPage } from './app.po';

describe('my-git-pay App', () => {
  let page: MyGitPayPage;

  beforeEach(() => {
    page = new MyGitPayPage();
  });

  xit('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
