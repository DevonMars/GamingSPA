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
    county: {
        type: String,
        required: true
    },
    number_of_employees: {
        type: Number,
        required: true
    }

});

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;