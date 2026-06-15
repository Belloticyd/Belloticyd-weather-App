


import express from 'express'

const router = express.Router()

// Simple test route
router.get('/', (req, res) => {
    res.json({ message: 'History route is working!', timestamp: new Date() })
})

router.post('/', (req, res) => {
    res.json({ message: 'POST to history working!', body: req.body })
})

export default router