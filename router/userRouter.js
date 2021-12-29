import express from "express";
import expressAsyncHandler from "express-async-handler";
import db from "../config/database.js";

const userRouter = express();

userRouter.post(
    '/',
    expressAsyncHandler(async (req, res) => {
        const {
            name,
            number,
            village,
            pincode,
            problems,
            needs
        } = req.body;
        try {
            await db.transaction( trx => {
                return trx('user')
                .where('number', '=', number)
                .then(user => {
                    if(!user.length){
                        return trx('user')
                        .insert({
                            'name':name,
                            'number':number,
                            'village':village,
                            'pincode':pincode,
                            'problems':problems,
                            'needs':needs
                        }
                        )
                        .then(() => {
                            res.status(200).send({
                                success:true,
                                message:"Added successfuly!"
                            })
                        })
                    } else{
                        res.status(400).send({
                            success:false,
                            message:"User with this phone number exists"
                        })
                    }
                }).then(trx.commit)
                .catch(trx.rollback);
            }) .catch(err => res.status(400).send({
                success: false,
                msg: err
            }))
            
        } catch (error) {
            res.status(500).send({
                success: false,
                msg: "server error"
            })
        }
    })
)

userRouter.get(
    '',
    expressAsyncHandler(async (req, res) => {
        try {
            await db('user')
            .select('*')
            .then(users => {
                res.status(200).send({
                    success:true,
                    users:users
                })
            }).catch(err => {
                res.status(400).send({
                    success:false,
                    message:"db error"
                })
            })
        } catch (error) {
            res.status(500).send({
                success:false,
                message:"server error"
            })
        }
    })
)

export default userRouter;