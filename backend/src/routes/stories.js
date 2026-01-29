const express = require("express");
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { createStoryBodySchema } = require("../schemas/stories");

const router = express.Router();

/*
* POST /stories
* Body: { userId, title, categories, situation, action, result }
*/
router.post("/", requireAuth, async (req, res) => {
    try {
        // 인증된 유저의 userId 가져오기
        const userId = req.user.userId;

        // 요청 바디 검증
        const parsed = createStoryBodySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid request body",
                details: parsed.error.issues,
            });
        }
        const { title, categories, situation, action, result } = parsed.data;
        
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

// GET /stories/:id
// 특정 스토리 가져오기
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        // userId 와 id 로 스토리 찾기
        const story = await prisma.story.findFirst({
            where: { 
                id,
                userId,
             },
        });

        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }

        return res.json({ story });
    } catch (error) {
        console.error("Error fetching story:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;