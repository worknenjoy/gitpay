import { expect } from 'chai'
import nock from 'nock'
import {
  parseAndValidateIssueUrl,
  parseKdeBugUrl
} from '../../../src/utils/issue/parse-and-validate-issue-url'
import {
  KdeConnect,
  kdeBugUri,
  kdeStateToGitpay
} from '../../../src/client/provider/kde'

describe('parseAndValidateIssueUrl', () => {
  it('parses a GitHub issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1098', 'github')
    ).to.deep.equal({
      userOrCompany: 'worknenjoy',
      projectName: 'gitpay',
      issueId: '1098',
      projectPath: 'worknenjoy/gitpay'
    })
  })

  it('parses a Bitbucket issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://bitbucket.org/atlassian/atlas/issues/12', 'bitbucket')
    ).to.deep.equal({
      userOrCompany: 'atlassian',
      projectName: 'atlas',
      issueId: '12',
      projectPath: 'atlassian/atlas'
    })
  })

  it('parses a KDE Bugzilla show_bug.cgi URL', () => {
    expect(
      parseAndValidateIssueUrl('https://bugs.kde.org/show_bug.cgi?id=341143', 'kde')
    ).to.deep.equal({
      userOrCompany: 'kde',
      projectName: 'bugs',
      issueId: '341143',
      projectPath: 'kde/bugs'
    })
  })

  it('parses a numeric KDE Bugzilla path', () => {
    expect(parseKdeBugUrl('https://bugs.kde.org/341143')).to.deep.equal({
      userOrCompany: 'kde',
      projectName: 'bugs',
      issueId: '341143',
      projectPath: 'kde/bugs'
    })
  })

  it('parses www.bugs.kde.org', () => {
    expect(
      parseAndValidateIssueUrl('https://www.bugs.kde.org/show_bug.cgi?id=99', 'kde')
    ).to.deep.equal({
      userOrCompany: 'kde',
      projectName: 'bugs',
      issueId: '99',
      projectPath: 'kde/bugs'
    })
  })

  it('rejects a KDE host when the provider is GitHub', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://bugs.kde.org/show_bug.cgi?id=341143', 'github')
    ).to.throw('URL host is not allowed for GitHub provider')
  })

  it('rejects a GitHub host when the provider is KDE', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1098', 'kde')
    ).to.throw('URL host is not allowed for KDE Bugzilla provider')
  })

  it('rejects a KDE URL without a bug id', () => {
    expect(() => parseAndValidateIssueUrl('https://bugs.kde.org/', 'kde')).to.throw(
      'Repository URL does not match expected issue pattern'
    )
  })
})

describe('kdeBugUri', () => {
  it('builds the Bugzilla REST URL used to import KDE bugs', () => {
    expect(kdeBugUri('341143')).to.equal('https://bugs.kde.org/rest/bug/341143')
  })
})

describe('kdeStateToGitpay', () => {
  it('maps Bugzilla is_open onto gitpay open/closed', () => {
    expect(kdeStateToGitpay({ is_open: true, status: 'CONFIRMED' })).to.equal('open')
    expect(kdeStateToGitpay({ is_open: false, status: 'RESOLVED' })).to.equal('closed')
    expect(kdeStateToGitpay({ status: 'VERIFIED' })).to.equal('closed')
  })
})

describe('KdeConnect', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('loads a public KDE bug through the shipped client', async () => {
    const scope = nock('https://bugs.kde.org', {
      reqheaders: {
        'User-Agent': 'gitpay',
        Accept: 'application/json'
      }
    })
      .get('/rest/bug/341143')
      .reply(200, {
        bugs: [
          {
            id: 341143,
            summary: 'Bring back per-virtual-desktop wallpapers',
            status: 'CONFIRMED',
            is_open: true,
            product: 'plasmashell',
            component: 'Image & Slideshow wallpaper plugins',
            creator_detail: { name: 'turbo477', real_name: 'Turbo' }
          }
        ]
      })

    const payload = await KdeConnect({ uri: kdeBugUri('341143') })

    expect(scope.isDone()).to.equal(true)
    expect(payload.bugs[0].summary).to.equal('Bring back per-virtual-desktop wallpapers')
    expect(payload.bugs[0].is_open).to.equal(true)
    expect(kdeStateToGitpay(payload.bugs[0])).to.equal('open')
  })
})
