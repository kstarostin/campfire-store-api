#!/usr/bin/env node
const { Types } = require('mongoose');

console.log(new Types.ObjectId().toString());
