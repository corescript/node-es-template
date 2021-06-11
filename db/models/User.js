const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const config = require('config');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: false,
            trim: true,
            text: true
        },
        lastName: {
            type: String,
            required: false,
            text: true
        }
    },
    { timestamps: { createdAt: 'createdDate', updatedAt: 'modifiedDate' } }
);

userSchema.plugin(mongoose_delete, { overrideMethods: true });

module.exports = mongoose.model('User', userSchema);
