import supertest from 'supertest';
import { vi, test, describe, assert } from 'vitest';

import app from '../app.js';
const api = supertest(app);
import helper from './test_helper.js';

vi.mock('../models/formModel.js', () => ({
  Form: {
    find: vi.fn(),
  },
}));

import Form from '../models/formModel.js';

describe('forms api', () => {
  test('forms are returned', async () => {
    Form.find.mockResolvedValue(helper.initialForms);

    const res = await api.get('/api/forms').expect(200);

    assert.strictEqual(res.body.length, helper.initialForms.length);
    assert.strictEqual(Form.find.mock.calls.length, 1);
  });
});
