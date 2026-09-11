import { expect } from 'chai'
import nock from 'nock'
import {
  parseAndValidateIssueUrl,
  parseGitlabIssuePath
} from '../../../src/utils/issue/parse-and-validate-issue-url'
import {
  GitlabConnect,
  gitlabIssueUri,
  gitlabStateToGitpay
} from '../../../src/client/provider/gitlab'

describe('parseAndValidateIssueUrl', () => {
  it('parses a GitHub issue URL', () => {
    expect(
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1097', 'github')
    ).to.deep.equal({
      userOrCompany: 'worknenjoy',
      projectName: 'gitpay',
      issueId: '1097',
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

  it('parses a GitLab issue URL with /-/issues/', () => {
    expect(
      parseAndValidateIssueUrl(
        'https://gitlab.com/mission-center-devs/mission-center/-/issues/3',
        'gitlab'
      )
    ).to.deep.equal({
      userOrCompany: 'mission-center-devs',
      projectName: 'mission-center',
      issueId: '3',
      projectPath: 'mission-center-devs/mission-center'
    })
  })

  it('parses a GitLab work item URL', () => {
    expect(
      parseAndValidateIssueUrl(
        'https://gitlab.com/mission-center-devs/mission-center/-/work_items/3',
        'gitlab'
      )
    ).to.deep.equal({
      userOrCompany: 'mission-center-devs',
      projectName: 'mission-center',
      issueId: '3',
      projectPath: 'mission-center-devs/mission-center'
    })
  })

  it('parses nested GitLab groups', () => {
    expect(
      parseGitlabIssuePath('https://gitlab.com/group/sub/project/-/issues/12')
    ).to.deep.equal({
      userOrCompany: 'group',
      projectName: 'project',
      issueId: '12',
      projectPath: 'group/sub/project'
    })
  })

  it('parses www.gitlab.com', () => {
    expect(
      parseAndValidateIssueUrl('https://www.gitlab.com/owner/repo/-/issues/99', 'gitlab')
    ).to.deep.equal({
      userOrCompany: 'owner',
      projectName: 'repo',
      issueId: '99',
      projectPath: 'owner/repo'
    })
  })

  it('rejects a GitLab host when the provider is GitHub', () => {
    expect(() =>
      parseAndValidateIssueUrl(
        'https://gitlab.com/mission-center-devs/mission-center/-/issues/3',
        'github'
      )
    ).to.throw('URL host is not allowed for GitHub provider')
  })

  it('rejects a GitHub host when the provider is GitLab', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://github.com/worknenjoy/gitpay/issues/1097', 'gitlab')
    ).to.throw('URL host is not allowed for GitLab provider')
  })

  it('rejects a non-issue GitLab path', () => {
    expect(() =>
      parseAndValidateIssueUrl('https://gitlab.com/mission-center-devs/mission-center', 'gitlab')
    ).to.throw('Repository URL does not match expected issue pattern')
  })
})

describe('gitlabIssueUri', () => {
  it('builds the GitLab issue API URL with an encoded project path', () => {
    expect(gitlabIssueUri('mission-center-devs/mission-center', '3')).to.equal(
      'https://gitlab.com/api/v4/projects/mission-center-devs%2Fmission-center/issues/3'
    )
    expect(gitlabIssueUri('group/sub/project', '12')).to.equal(
      'https://gitlab.com/api/v4/projects/group%2Fsub%2Fproject/issues/12'
    )
  })
})

describe('gitlabStateToGitpay', () => {
  it('maps GitLab opened/closed onto gitpay open/closed', () => {
    expect(gitlabStateToGitpay('opened')).to.equal('open')
    expect(gitlabStateToGitpay('reopened')).to.equal('open')
    expect(gitlabStateToGitpay('closed')).to.equal('closed')
  })
})

describe('GitlabConnect', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('loads a public GitLab issue through the shipped client', async () => {
    const scope = nock('https://gitlab.com', {
      reqheaders: {
        'User-Agent': 'gitpay',
        Accept: 'application/json'
      }
    })
      .get(/\/api\/v4\/projects\/.+\/issues\/3$/)
      .reply(200, {
        iid: 3,
        title: 'Add network usage column to the Apps page',
        description: 'Show network usage',
        state: 'closed',
        web_url: 'https://gitlab.com/mission-center-devs/mission-center/-/work_items/3',
        labels: ['Type::Feature/Enhancement'],
        author: {
          username: 'kicsyromy',
          avatar_url: 'https://gitlab.com/uploads/-/system/user/avatar/2727510/avatar.png'
        }
      })

    const issue = await GitlabConnect({
      uri: gitlabIssueUri('mission-center-devs/mission-center', '3')
    })

    expect(scope.isDone()).to.equal(true)
    expect(issue.title).to.equal('Add network usage column to the Apps page')
    expect(issue.state).to.equal('closed')
    expect(issue.description).to.equal('Show network usage')
    expect(issue.author.username).to.equal('kicsyromy')
    expect(gitlabStateToGitpay(issue.state)).to.equal('closed')
  })
})
