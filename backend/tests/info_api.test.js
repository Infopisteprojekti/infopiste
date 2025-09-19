import test from "node:test";
import assert from "node:assert";
import supertest from "supertest";
import app from "../server.js";

const api = supertest(app)

test("health check returns ok", async () => {
    const res = await api.get("/health").expect(200)

    assert.strictEqual(res.body.status, "ok")
})
