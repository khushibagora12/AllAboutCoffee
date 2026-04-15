import { Router } from "express";
const router = Router()
import {User} from '../db/DB.js'

router.get('/allUsers', async(req, res) => {
    // console.log("in all users route");
    try{
        const allusers = await User.find();
        // console.log(allusers);
        // console.log(allusers[0]._id.toString());
        res.json({'users' : allusers.map((user) => {
                return {
                    username : user.username,
                    userId : user._id.toString()
                }
            })
        })
    }
    catch(err){
        console.log(err);
        res.json({message: 'Error fetching users'})
    }
});

export default router;