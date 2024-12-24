import { Router } from "express";
import { addIncome, deleteIncome, getAllIncome, getIncome, updateIncome } from "../Controllers/income.js";


const router = Router();

router.get('/', getAllIncome)
    .get('/:id', getIncome)
    .post('/', addIncome)
    .put('/:id', updateIncome)
    .delete('/:id', deleteIncome);


    


export default router;
