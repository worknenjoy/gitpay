import * as Projects from '../../modules/projects'

export const fetchProject = async (req: any, res: any) => {
  try {
    const data = await Projects.projectFetch(req.params, req.query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const listProjects = async (req: any, res: any) => {
  try {
    const data = await Projects.projectList(req.params)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}
