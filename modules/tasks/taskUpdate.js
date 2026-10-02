const { Task, Order } = require('../models');
const { syncTask } = require('./taskSync');
const { updateTaskStatus } = require('./taskStatus');

async function taskUpdate(req, res) {
  try {
    const { id } = req.params;
    const { status, ...updateData } = req.body;
    
    let task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Se houver mudança de status, processamos a lógica de pagamento/status
    if (status) {
      task = await updateTaskStatus(task, status, req.user);
    }

    // Atualiza os demais dados da task
    await task.update(updateData);

    // A mudança crucial: Chamamos o syncTask no Backend para garantir que 
    // os valores de bounty e status de pagamento estejam atualizados antes de responder
    const updatedTask = await syncTask(task);

    // Verificamos se foi criada uma nova ordem de pagamento vinculada a esta task
    const latestOrder = await Order.findOne({
      where: { taskId: task.id },
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      task: updatedTask,
      order: latestOrder || null
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { taskUpdate };
