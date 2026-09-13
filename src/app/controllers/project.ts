import { projectList, projectFetch } from '../../modules/projects'

export const fetchProject = async (req: any, res: any) => {
  try {
    const data = await projectFetch(req.params || req.query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const listProjects = async (req: any, res: any) => {
  try {
    // `/list` has no route params, so `req.params` is always `{}` — truthy,
    // which meant the `req.query` fallback below was dead code and this
    // endpoint could never actually be filtered.
    const data = await projectList(req.query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}
