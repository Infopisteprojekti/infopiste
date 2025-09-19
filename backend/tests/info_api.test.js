import test from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import app from "../server.js";

const api = supertest(app)

test("health check returns ok", async () => {
    const res = await api.get("/health").expect(200)

    assert.strictEqual(res.body.status, "ok")
})

test("rooms are returned", async () => {
    const res = await api
        .get("/api/rooms")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    assert.strictEqual(Array.isArray(res.body), true, "rooms are in array")
    assert.ok(res.body.length > 0, "room array is not empty")
})

test("room with correct id is found", async () => {
    const res = await api
        .get("/api/rooms/A310")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
    assert.strictEqual(res.body.id, "A310")
})

test("reservations for specific room are returned", async () => {
    const res = await api.get("/api/rooms/A310/reservations").expect(200)

    assert.strictEqual(Array.isArray(res.body), true, "reservations are in array")
})
