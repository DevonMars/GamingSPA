const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    founder: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    total_employees: {
        type: Number,
        required: true
    },

    gameId: [{
        type: Schema.Types.ObjectId,
        ref: 'game',
        required: true
    }]

});

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;