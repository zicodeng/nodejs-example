'use strict';

const MongoStore = require('./taskstore');
const mongodb = require('mongodb');

const mongoAddr = process.env.DBADDR || '192.168.99.100:27017';
const mongoURL = `mongodb://${mongoAddr}/tasks`;

describe('Mongo Task Store', () => {
    test('CRUD Cycle', () => {
        return mongodb.MongoClient.connect(mongoURL).then(db => {
            let store = new MongoStore(db, 'tasks');
            let task = {
                title: 'Learn Node.js to MongoDB',
                tags: ['mongodb', 'node.js']
            };

            return store
                .insert(task)
                .then(task => {
                    expect(task._id).toBeDefined();
                    return task._id;
                })
                .then(taskID => {
                    return store.get(taskID);
                })
                .then(fetchedTask => {
                    expect(fetchedTask).toEqual(task);
                    return store.update(task._id, { completed: true });
                })
                .then(updatedTask => {
                    expect(updatedTask.completed).toBe(true);
                    return store.delete(task._id);
                })
                .then(() => {
                    return store.get(task._id);
                })
                .then(fetchedTask => {
                    expect(fetchedTask).toBeFalsy();
                })
                .then(() => {
                    // If everything went well and all tests passed,
                    // close database connection.
                    db.close();
                })
                .catch(err => {
                    db.close();
                    throw err;
                });
        });
    });
});
