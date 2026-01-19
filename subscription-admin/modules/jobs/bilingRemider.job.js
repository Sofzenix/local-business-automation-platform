import cron from 'node-cron';
import Billing from '../billing/billing.model.js'

export function startBillingReminderJob() {
    cron.schedule("0 9 * * *", async () => {
        const today = new Date();
        const MS_IN_DAY = 1000 * 60 * 60 * 24;//milliseconds in a day

        const bills = await Billing.find({ status: "PENDING" });

        for (const bill of bills) {
            const diffDays = Math.ceil(
                (bill.dueDate - today) / MS_IN_DAY
            );

            if (diffDays === 3 || diffDays === 1) {
                console.log(`Reminder D-${diffDays} for invoice ${bill.invoiceNumber}`)
            };

            if (diffDays === 2) {
                console.log(`Overdue reminder for invoice ${bill.invoiceNumber}`);
                bill.status = "OVERDUE";
                await bill.save();
            };

        };
    });
};