const mongoose = require('mongoose');
const id = new mongoose.Types.ObjectId();
console.log(id == id.toString());
console.log(id === id.toString());
console.log(id == String(id));
