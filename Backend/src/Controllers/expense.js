import { format } from "date-fns";
import expenseModal from "../Modals/expenseModal.js";

export const addExpense = async (req, res, next) => {
    try {
        const { title, amount, type, date, category, description } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount should be greater than 0" });
        }
        if (amount > 10000000) {
            return res.status(400).json({ error: "Amount should be less than 10000000" });
        }

        const expense = new expenseModal({ title, amount, type, date, category, description });
        await expense.save();
        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const getAllExpense = async (req, res, next) => {
    try {
        const expense = await expenseModal.find();

        if (!expense || expense.length === 0) {
            return res.status(400).json({ error: "No expense found" });
        }

        const formattedData = expense.map((item) => ({
            ...item._doc,
            date: format(new Date(item.date), "yyyy-MM-dd HH:mm:ss"),
            createdAt: format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss"),
            updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm:ss"),
        }));

        res.status(200).json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const getExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const expense = await expenseModal.findById(id);

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        const formattedData = {
            ...expense._doc,
            date: format(new Date(expense.date), "yyyy-MM-dd HH:mm:ss"),
        };

        res.status(200).json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const expense = await expenseModal.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully", data: expense });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const updatedExpense = await expenseModal.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true } 
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json({ message: "Expense updated successfully", data: updatedExpense });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};
