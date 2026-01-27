const express = require("express");
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

/*
* POST /stories
* Body: { userId, title, categories, situation, action, result }
*/
router.post("/", requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, categories, situation, action, result } = req.body;

        if (!title) {
            return res.status(400).json({ error: "title is required" });
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ error: "At least one category is required" });
        }

        const story = await prisma.story.create({
            data: {
                userId,
                title,
                categories,
                situation: situation ?? "",
                action: action ?? "",
                result: result ?? "",
            },
        });

        return res.status(201).json( {story} );
    } catch (error) {
        console.error("Error creating story:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}); 

/*
* GET /stories
*/
router.get("/", requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const stories = await prisma.story.findMany({
            where: { userId: String(userId) },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({ stories });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;