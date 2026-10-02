import { expect } from 'chai'
import nock from 'nock'
import { parseAndValidateIssueUrl } from '../../../src/utils/issue/parse-and-validate-issue-url'
import { CodebergConnect, codebergIssueUri } from '../../../src/client/provider/codeberg'

describe('parseAndValidateIssueUrl', () => {
  it('parses a GitHub issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1150', 'github')
    ).to.deep.equal({
      userOrCompany: 'worknenjoy',
      projectName: 'gitpay',
      issueId: '1150'
    })
  })

  it('parses a Bitbucket issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://bitbucket.org/atlassian/atlas/issues/12', 'bitbucket')
    ).to.deep.equal({
      userOrCompany: 'atlassian',
      projectName: 'atlas',
      issueId: '12'
    })
  })

  it('parses a Codeberg issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://codeberg.org/forgejo/forgejo/issues/1', 'codeberg')
    ).to.deep.equal({
      userOrCompany: 'forgejo',
      projectName: 'forgejo',
      issueId: '1'
    })
  })

  it('parses www.codeberg.org', () => {
    expect(
      parseAndValidateIssueUrl('https://www.codeberg.org/owner/repo/issues/99', 'codeberg')
    ).to.deep.equal({
      userOrCompany: 'owner',
      projectName: 'repo',
      issueId: '99'
    })
  })

  it('rejects a Codeberg host when the provider is GitHub', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://codeberg.org/forgejo/forgejo/issues/1', 'github')
    ).to.throw('URL host is not allowed for GitHub provider')
  })

  it('rejects a GitHub host when the provider is Codeberg', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1150', 'codeberg')
    ).to.throw('URL host is not allowed for Codeberg provider')
  })

  it('rejects a non-issue path', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://codeberg.org/forgejo/forgejo', 'codeberg')
    ).to.throw('Repository URL does not match expected issue pattern')
  })
})

describe('codebergIssueUri', () => {
  it('builds the Forgejo issue API URL used to import Codeberg issues', () => {
    expect(codebergIssueUri('forgejo', 'forgejo', '1')).to.equal(
      'https://codeberg.org/api/v1/repos/forgejo/forgejo/issues/1'
    )
  })
})

describe('CodebergConnect', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('loads a public Codeberg issue through the shipped client', async () => {
    const scope = nock('https://codeberg.org', {
      reqheaders: {
        'User-Agent': 'gitpay',
        Accept: 'application/json'
      }
    })
      .get('/api/v1/repos/forgejo/forgejo/issues/1')
      .reply(200, {
        number: 1,
        title: 'Configure Woodpecker',
        body: 'ci',
        state: 'closed',
        html_url: 'https://codeberg.org/forgejo/forgejo/issues/1',
        user: { login: 'Ghost', avatar_url: 'https://codeberg.org/avatar.png' }
      })

    const issue = await CodebergConnect({
      uri: codebergIssueUri('forgejo', 'forgejo', '1')
    })

    expect(scope.isDone()).to.equal(true)
    expect(issue.title).to.equal('Configure Woodpecker')
    expect(issue.state).to.equal('closed')
    expect(issue.user.login).to.equal('Ghost')
  })
})
