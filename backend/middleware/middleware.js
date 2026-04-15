import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        if(token){
            const verify = await jwt.verify(token, JWT_SECRET);
            if(verify){
                console.log(verify);
                req.userId = verify.id;
                next();
            }else{
                res.status(404).send("error");
            }
        }
        else{
            res.send("token not found");
        }
    } catch (error) {
        console.log("Something went wrong! ", error);
    }
}