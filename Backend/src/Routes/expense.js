import { Router } from "express";
import { addExpense, deleteExpense, getAllExpense, getExpense, updateExpense } from "../Controllers/expense.js";


const router = Router();

router.get('', getAllExpense)
    .get('/:id', getExpense)
    .post('/', addExpense)
    .put('/:id', updateExpense)
    .delete('/:id', deleteExpense);





export default router;
