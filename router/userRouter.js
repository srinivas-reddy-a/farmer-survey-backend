import express from "express";
import expressAsyncHandler from "express-async-handler";
import db from "../config/database.js";

const userRouter = express();

userRouter.post(
    '/',
    expressAsyncHandler(async (req, res) => {
        let {
            name,
            number,
            village,
            pincode,
            problems,
            needs
        } = req.body;
        name = name.trim();
        village = village.trim();
        problems = problems.trim();
        needs = needs.trim();
        try {
            await db.transaction(async trx => {
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
                            'needs':needs,
                            'created_at':new Date()
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
    '/',
    expressAsyncHandler(async (req, res) => {
        const limit = req.query.limit || 1000000;
        try {
            await db('user')
            .where((qb) => {
                if(req.query.name){
                    qb.where('name','like',`%${req.query.name}%`)
                }
                if(req.query.number){
                    qb.where('number','like',`%${req.query.number}%`)
                }
                if(req.query.village){
                    qb.where('village','like',`%${req.query.village}%`)
                }
                if(req.query.pincode){
                    qb.where('pincode','like',`%${req.query.pincode}%`)
                }
            })
            .limit(limit)
            .orderBy('name','asc')
            .then(users => {
                res.status(200).send({
                    success:true,
                    users:users
                })
            }).catch(err => {
                res.status(400).send({
                    success:false,
                    message:err
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