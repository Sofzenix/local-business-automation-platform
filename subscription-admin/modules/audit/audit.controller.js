import { getAuditLogs } from "./audit.service.js";

export async function listAuditLogs(req , res){
    try{
        //extract filters if any
        const {entityType , entityId , from , to , limit} = req.query;

        const logs = await getAuditLogs({entityType,entityId,from , to , limit});

        return res.status(200).json({success:true , message:"" , data:logs});
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success:false ,
            code:"INTERNAL_SERVER_ERROR",
            message:"Failed to fetch audit logs"
        });
    }
}