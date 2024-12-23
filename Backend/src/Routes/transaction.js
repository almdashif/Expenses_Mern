import { Router } from "express";
const router = Router();

router.get('/transaction', (req, res) => {
    console.log('get transaction');
    res.send('Get transaction');
}).post('/transaction', (req, res) => {
    res.send('Post transaction');
}).put('/transaction', (req, res) => {
    res.send('Put transaction');
}).delete('/transaction', (req, res) => {
    res.send('Delete transaction');
});

export default router;
