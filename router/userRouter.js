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
        village?village = village.trim():village
        problems?problems.trim():problems
        needs?needs.trim():needs
        try {
            await db.transaction(async trx => {
                return trx('user')
                .where('number', '=', number)
                .then(async user => {
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
                if(req.query.search){
                    qb.where('name','like',`%${req.query.search}%`)
                    .orWhere('number','like',`%${req.query.search}%`)
                    .orWhere('village','like',`%${req.query.search}%`)
                    .orWhere('pincode','like',`%${req.query.search}%`)
                }
            })
            .limit(limit)
            .orderBy('id','desc')
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