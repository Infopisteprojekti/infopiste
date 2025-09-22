const supertest = require('supertest');
const mongoose = require('mongoose');
const { test, describe, after, beforeEach } = require('node:test');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const assert = require('assert');

const File = require('../models/file');

describe.skip('when there are initially some files saved', () => {
  beforeEach(async () => {
    await File.deleteMany({});
    await File.insertMany(helper.initialFiles);
  });

  test('files are returned as json', async () => {
    const response = await api
      .get('/api/files')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialFiles.length);
  });

  test('files are returned with id property', async () => {
    const response = await api.get('/api/files');
    response.body.forEach(file => {
      assert(file.id);
    });
  });

  test('a valid file can be added', async () => {
    const newFile = {
      originalName: 'newfile.pdf',
      filename: '123456789-newfile.pdf',
    };

    const response = await api
      .post('/api/files')
      .send(newFile)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.originalName, newFile.originalName);
    assert.strictEqual(response.body.filename, newFile.filename);

    await api.get('/api/files');

    const filesAtEnd = await helper.filesInDb();

    const originalNames = filesAtEnd.map(f => f.originalName);

    assert(originalNames.includes('newfile.pdf'));
  });

  after(() => {
    mongoose.connection.close();
  });
});
