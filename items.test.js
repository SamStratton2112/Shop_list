process.env.NODE_ENV = "test"

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let seltzer = { name : "seltzer", price : 0.99 }

beforeEach(function(){
    items.push(seltzer);
});

afterEach(function(){
    items.length = 0;
});


describe("GET /items", ()=>{
    test("Get all items", async ()=>{
        const res = await request(app).get('/items');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items : [seltzer]});
    })
})


describe("GET /items/:name", ()=>{
    test("Get an item by name", async ()=>{
        const res = await request(app).get('/items/seltzer');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item : { name : "seltzer", price : 0.99 }});
    })
    test("Get item that does not exist", async()=>{
        const res = await request(app).get('/items/seltz');

        expect(res.body).toEqual({error : "Item not found"});
    })
})

describe("POST /items", ()=>{
    test("Add an item", async ()=>{
        const res = await request(app).post('/items').send({ name: "Peaches", price : 1.25 });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({item : { name: "Peaches", price : 1.25 }});
    })
    test("Add incomplete item", async ()=>{
        const res = await request(app).post('/items').send({ name: "Peaches" });
        
        expect(res.body).toEqual({error : "Name and Price are Required!"});;
    })
})

describe("PATCH /items/:name", ()=>{
    test("Update an item", async ()=>{
        const res = await request(app).patch("/items/seltzer").send({ name : "Club Soda", price : 0.99 });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated : { name : "Club Soda", price : 0.99 }});
    })
    test("Update an item that does not exist", async ()=>{
        const res = await request(app).patch("/items/seltz").send({ name : "Club Soda", price : 0.99 });
        
        expect(res.body).toEqual({error : "Item not found"});
    })
})

describe("DELETE /items/:name", ()=>{
    test("Delete Item", async () => {
        const res = await request(app).delete(`/items/${seltzer.name}`);

        expect(res.body).toEqual({ message: 'Deleted'} );
    })
    test("Delete item that does not exist", async ()=>{
        const res = await request(app).delete('/items/seltz');

        expect(res.body).toEqual({error : "Item not found"});
    })
})