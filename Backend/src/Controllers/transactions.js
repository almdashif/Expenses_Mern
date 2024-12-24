import expenseModal from "../Modals/expenseModal.js";
import incomeModal from "../Modals/incomeModal.js";

export const transactions = async (req, res) => {
    try {
        const incomeData = await incomeModal.find().lean();

        const expenseData = await expenseModal.find().lean();

        const transactions = [
            ...incomeData.map(item => ({ ...item, type: 'income', date: item.date })),
            ...expenseData.map(item => ({ ...item, type: 'expense', date: item.date }))
        ];

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ data: transactions });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}