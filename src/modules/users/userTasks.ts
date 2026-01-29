import models from '../../models'

const currentModels = models as any

export async function userTasks(id: number) {
  try {
    // finds all accepted assigns for user
    const assigns = await currentModels.Assign.findAll({
      attributes: ['TaskId'],
      where: {
        userId: id,
        status: 'accepted'
      }
    })
    
    /*
      finds completed tasks for each assigns and returns
      an array of promises to be resolved by .all()
    */
    const taskPromises = assigns.map(async (a: any) => {
      try {
        const res = await currentModels.Task.findOne({
          attributes: ['value', 'paid'],
          where: {
            id: a.dataValues.TaskId,
            status: 'closed'
          }
        })
        
        if (res !== null) {
          return res.dataValues
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error at userTasks', error)
        throw error
      }
    })
    
    const res = await Promise.all(taskPromises)
    const filteredRes = res.filter((r) => r !== undefined)
    let bounties = 0
    // If the task is paid adds the value to "bounties"
    filteredRes.forEach((t: any) => {
      if (t.paid === true) {
        bounties += Number(t.value)
      }
    })
    // return object containing number of tasks completed and total bounties collected.
    return {
      tasks: filteredRes.length.toString(),
      bounties: bounties.toString()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error at userTasks', error)
    throw error
  }
}
