const express=require('express')
const router=express.Router()
const authController=require('./../controller/authController')
const taskController=require('./../controller/taskController');

router
    .route('/:id')
    .get(taskController.getTasksByGoalId)
    .patch(
        authController.protect,
        taskController.updateTask
    )
    .delete(
        authController.protect,
        taskController.deleteTask
    )

module.exports = router;