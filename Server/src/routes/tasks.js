const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

async function hasProjectAccess(userId, projectId) {
  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      OR: [
        { createdById: userId },
        { members: { some: { userId } } }
      ]
    }
  });

  return !!project;
}

router.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assignedToId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    const canAccess = await hasProjectAccess(req.user.id, projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (assignedToId) {
      const memberExists = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: Number(projectId),
            userId: Number(assignedToId)
          }
        }
      });

      if (!memberExists) {
        return res.status(400).json({ message: "Assigned user must be a project member" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: Number(projectId),
        assignedToId: assignedToId ? Number(assignedToId) : null,
        createdById: req.user.id
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    const canAccess = await hasProjectAccess(req.user.id, projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canAccess = await hasProjectAccess(req.user.id, task.projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role !== "ADMIN" && task.assignedToId !== req.user.id) {
      return res.status(403).json({ message: "You can update only your assigned tasks" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status }
    });

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const { title, description, status, dueDate, assignedToId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canAccess = await hasProjectAccess(req.user.id, task.projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (assignedToId) {
      const memberExists = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: task.projectId,
            userId: Number(assignedToId)
          }
        }
      });

      if (!memberExists) {
        return res.status(400).json({ message: "Assigned user must be a project member" });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status: validStatuses.includes(status) ? status : undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: assignedToId ? Number(assignedToId) : null
      }
    });

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canAccess = await hasProjectAccess(req.user.id, task.projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;