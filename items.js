const express = require("express")
const router = new express.Router()
const ExpressError = require("./error")
const items = require("./fakeDb")


router.get("/", function (req,res, next){
    try{
        res.json({items})
    } catch(e){
        next(e)
    }
})

router.post('/', function (req,res,next){
    try{
        if(!req.body.name | !req.body.price){
            throw new ExpressError("Name and Price are Required!", 400);
        } 
        const newItem = { name: req.body.name, price: +req.body.price }
        items.push(newItem)
        return res.status(201).json({item:newItem})
    } catch(e){
        return next(e)
    }
})

router.get('/:name', function (req,res,next){
    try{
        const item = items.find(i => i.name === req.params.name)
        if(item === undefined){
            throw new Error("Item not found", 404)
        }
        return res.status(200).json({item : {name : item.name, price : +item.price}})
    } catch(e) {
        next(e)
    }
})

router.patch('/:name', function (req,res,next){
    try{
        const item = items.find(i => i.name === req.params.name)
        if(item === undefined){
            throw new Error("Item not found", 404)
        }
        item.name = req.body.name
        item.price = +req.body.price
        return res.status(200).json({updated : {name : item.name, price : item.price}})
    } catch(e){
        next(e)
    }
})

router.delete('/:name', function(req,res,next){
    try{
        const item = items.find(i => i.name === req.params.name)
        if(item === undefined){
            throw new Error("Item not found", 404)
        }
        items.splice(item, 1)
        return res.status(200).json({message: "Deleted"})
    } catch(e){
        next(e)
    }
})

module.exports=router;
