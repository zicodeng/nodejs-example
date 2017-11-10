// @ts-check
'user strict';

const mongodb = require('mongodb');
const MongoStore = require('./taskstore');
const express = require('express');
const app = express();

const addr = process.env.ADDR || 'localhost:4000';
const [host, port] = addr.split(':');
const portNum = parseInt(port);

const mongoAddr = process.env.DBADDR || '192.168.99.100:27017';
const mongoURL = `mongodb://${mongoAddr}/tasks`;

// Guarantee our MongoDB is started before clients can make any connections.
mongodb.MongoClient
    .connect(mongoURL)
    .then(db => {
        let taskStore = new MongoStore(db, 'tasks');

        // parses posted JSON and makes
        // it available from req.body.
        app.use(express.json());

        app.post('/v1/tasks', (req, res) => {
            let task = {
                title: req.body.title,
                completed: false
            };
            taskStore
                .insert(task)
                .then(task => {
                    res.json(task);
                })
                .catch(err => {
                    throw err;
                });
        });

        app.get('/v1/tasks', (req, res) => {
            taskStore
                .getAll(false)
                .then(tasks => {
                    res.json(tasks);
                })
                .catch(err => {
                    throw err;
                });
        });

        app.patch('/v1/tasks/:taskID', (req, res) => {
            // MongoDB doesn't store _id as string,
            // it stores it as 12 byte binary BSON type.
            // So we need to convert our string ID to BSON first.
            let taskIDToUpate = new mongodb.ObjectID(req.params.taskID);
            let update = {
                completed: req.body.completed
            };
            taskStore
                .update(taskIDToUpate, update)
                .then(updatedTask => {
                    res.json(updatedTask);
                })
                .catch(err => {
                    throw err;
                });
        });

        app.listen(portNum, host, () => {
            console.log(`server is listening at http://${addr}`);
        });
    })
    .catch(err => {
        throw err;
    });
