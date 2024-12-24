import { format } from "date-fns";
import incomeModal from "../Modals/incomeModal.js";

export const addIncome = async (req, res, next) => {
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

        const income = new incomeModal({ title, amount, type, date, category, description });
        await income.save();
        res.status(201).json({ message: "Income added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const getAllIncome = async (req, res, next) => {
    try {
        const income = await incomeModal.find();

        if (!income || income.length === 0) {
            return res.status(400).json({ error: "No income found" });
        }

        const formattedData = income.map((item) => ({
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

export const getIncome = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const income = await incomeModal.findById(id);

        if (!income) {
            return res.status(404).json({ error: "Income not found" });
        }

        const formattedData = {
            ...income._doc,
            date: format(new Date(income.date), "yyyy-MM-dd HH:mm:ss"),
        };

        res.status(200).json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const deleteIncome = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const income = await incomeModal.findByIdAndDelete(id);

        if (!income) {
            return res.status(404).json({ error: "Income not found" });
        }

        res.status(200).json({ message: "Income deleted successfully", data: income });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};

export const updateIncome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ error: "Id is required" });
        }

        const updatedIncome = await incomeModal.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true } 
        );

        if (!updatedIncome) {
            return res.status(404).json({ error: "Income not found" });
        }

        res.status(200).json({ message: "Income updated successfully", data: updatedIncome });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    } finally {
        next();
    }
};
