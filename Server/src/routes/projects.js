const express = require("express");
const prisma = require("../prisma");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

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
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id,
        members: {
          create: {
            userId: req.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
        }
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: req.user.id },
          { members: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
        },
        tasks: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const canAccess = await hasProjectAccess(req.user.id, req.params.id);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
        },
        tasks: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true, role: true }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/:id/members", auth, requireRole("ADMIN"), async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Member email is required" });
    }

    const canAccess = await hasProjectAccess(req.user.id, projectId);

    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ message: "User already in project" });
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id
      }
    });

    return res.json({ message: "Member added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;