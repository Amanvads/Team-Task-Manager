const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const whereCondition = {
      OR: [
        { project: { createdById: req.user.id } },
        { project: { members: { some: { userId: req.user.id } } } }
      ]
    };

    const total = await prisma.task.count({
      where: whereCondition
    });

    const todo = await prisma.task.count({
      where: {
        ...whereCondition,
        status: "TODO"
      }
    });

    const inProgress = await prisma.task.count({
      where: {
        ...whereCondition,
        status: "IN_PROGRESS"
      }
    });

    const done = await prisma.task.count({
      where: {
        ...whereCondition,
        status: "DONE"
      }
    });

    const overdue = await prisma.task.count({
      where: {
        ...whereCondition,
        dueDate: {
          lt: new Date()
        },
        status: {
          not: "DONE"
        }
      }
    });

    return res.json({
      total,
      todo,
      inProgress,
      done,
      overdue
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;