const express=require('express')
const router=express.Router()
const authController=require('./../controller/authController')
const goalController = require('./../controller/goalController');
const taskController = require("./../controller/taskController");

router
    .route('/')
    .post(
        authController.protect,
        goalController.createGoal
    )
    .get(
        authController.protect,
        goalController.getAllUserGoalsWithSubtasks
    )

router
    .route('/:id')
    .get(goalController.getGoalsByGoalId)
    .patch(
        authController.protect,
        goalController.updateGoal
    )
    .delete(
        authController.protect,
        goalController.deleteGoal
    )

    router
      .route("/:id/tasks")
      .post(
          authController.protect,
          taskController.createTask
      );
      
module.exports = router;