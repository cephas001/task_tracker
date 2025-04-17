const router = require("express").Router();
const mongodb = require("mongodb");
const isAuthenticated =
  require("../../auth/authentication_middleware").isAuthenticated;
const reqUserMiddleware =
  require("../../middlewares/req_user_middleware").identifyUser;
const Task = require("../../models/Task");
const DeletedTask = require("../../models/DeletedTask");

 
// GET ALL TASKS FOR LOGGED IN USER
router.get("/tasks", isAuthenticated, reqUserMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }, null, {
      sort: { updatedAt: -1 },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Problem with server" });
  } 
});

router.get("/deleted_task", isAuthenticated, reqUserMiddleware, async (req, res) => {
  try {
    const tasks = await DeletedTask.find({ user: req.user._id }, null, {
      sort: { createdAt: -1 },
    });
    if(tasks[0]) {
      const { id, task, description, date, agendas, isCompleted, user} = tasks[0]
      const taskToResave = new Task({ task, description, date, agendas, isCompleted,  user})
      const response = await taskToResave.save()
      if(response){
        await DeletedTask.deleteOne({id})
        return res.json({message: "Task has been resaved", resaved: true})
      }  
    } else {
      res.json({message: "Database is empty", resaved: false})
    }
    
  } catch (err) {
    res.status(500).json({ message: "Problem with server" });
  }
});

// GET ONE TASK FOR LOGGED IN USER
router.get(
  "/tasks/:id",
  isAuthenticated,
  reqUserMiddleware,
  async (req, res) => { 
    try { 
      const tasks = await Task.find({
        user: req.user._id,
      });
      const task = await tasks.find((task) => task._id == req.params.id);
      if (!task) {
        res.status(404).json({ message: "No task with the id provided" });
      }
      res.send(task);
    } catch (err) {
      res.status(500).json({ message: "Problem with server" });
    }
  }
);

// ADD A TASK FOR THE LOGGED IN USER
router.post("/tasks", isAuthenticated, reqUserMiddleware, async (req, res) => {
  try {
    const currentUser = req.user._id;
    req.body.user = new mongodb.ObjectID(currentUser);
    const { task, date, user, description, agendas } = req.body;

    const taskToAdd = new Task({
      task,
      date,
      user,
      description,
      agendas,
    });

    const response = await taskToAdd.save();
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Problem with server" });
  }
});

// DELETE TASK FOR LOGGED IN USER
router.delete("/tasks/:id", isAuthenticated, async (req, res) => {
  try {
    const tasks = await DeletedTask.find({})
    if(tasks.length > 0){
      await DeletedTask.deleteMany({})
    }
    const { task, date, description, agendas, isCompleted, user} = await Task.findOne({ _id: new mongodb.ObjectID(req.params.id) });
    const taskToAddD = new DeletedTask({
      task,
      date, 
      description,
      agendas,  
      user,
      isCompleted
    })
    const response = await taskToAddD.save()
    if(response) {
      await Task.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
      res.status(200).json({ message: "Deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Problem with server" });
  }
});

// Updating an already made task
router.put(
  "/tasks/:id",
  isAuthenticated,
  reqUserMiddleware,
  async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user._id });
      const taskToEdit = tasks.find((task) => task._id == req.params.id);
      var agendaToEdit = {};
      if (!req.body.agendaId) {
        agendaToEdit = taskToEdit.agendas[0];
      } else {
        agendaToEdit = taskToEdit.agendas.find(
          (agenda) => agenda.id == req.body.agendaId
        );
      }
      const remainingAgendas = taskToEdit.agendas.filter(
        (agenda) => agenda.id !== agendaToEdit.id
      );
      const updatedTask = await Task.updateOne(
        { _id: new mongodb.ObjectID(req.params.id) },
        {
          $set: {
            task: req.body.task == "" ? taskToEdit.task : req.body.task,
            date: req.body.date == "" ? taskToEdit.date : req.body.date,
            description:
              req.body.description == ""
                ? taskToEdit.description
                : req.body.description,
            isCompleted: req.body.isCompleted,
            agendas: [
              {
                _id: agendaToEdit._id,
                agenda:
                  req.body.agenda == ""
                    ? req.body.agenda
                    : !req.body.agenda
                    ? agendaToEdit.agenda
                    : req.body.agenda,
                agendaIsCompleted:
                  typeof req.body.agendaIsCompleted == "undefined"
                    ? agendaToEdit.agendaIsCompleted
                    : req.body.agendaIsCompleted,
              },
              ...remainingAgendas,
            ],
          },
        }
      );
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: "Problem with server" });
    }
  }
);

module.exports = router;
