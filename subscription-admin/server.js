import express from 'express'
import router from './modules/subscription/subscription.routes.js';
import connectToDB from './config.js';
import { checkSubscription } from './modules/middlewares/subscription.middleware.js';
import { startSubscriptionExpiryJob } from './modules/jobs/subscriptionExpiry.job.js';
import adminRouter from './modules/admin/admin.routes.js';
import { startBillingReminderJob } from './modules/jobs/bilingRemider.job.js';
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use('/api/subscription' ,router );
server.use('/api/admin' , adminRouter)


server.get('/read/:businessId' , checkSubscription('read'));
server.get('/write/:businessId',checkSubscription('write'));
// server.use((req,res)=>{
//     res.status(200).send("Working as intended");
// })
const PORT = 3000;
server.listen(PORT ,async ()=>{
    console.log(`Server is listening on port ${PORT}...`)
    await connectToDB();
    await startSubscriptionExpiryJob();
     startBillingReminderJob();
});