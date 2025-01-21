import mongoose, { Schema, model } from 'mongoose';

const SettingsSchema = new Schema({
    restaurantName: {type: String, required: true},
    logoUrl: { type: String },
    description: {type: String},
    tables: {type: Number, required: true},
    tablesPerZone: [{
        zone: {type: String, required: true},
        count: {type: Number, required: true},
    }],
    contactInfo: {
        address: {type: String, required: true},
        phone: {type: String, required: true},
        email: {type: String},
    },
    bankAccount: {
        bankName: {type: String},
        accountNumber: {type: String},
        accountName: {type: String},
    },
    socialMedia: {
        facebook: {type: String},
        zalo: {type: String},
        instagram: {type: String},
    },
    telegramToken: {type: String},
    chatId: {type: String}

})

export const Settings = mongoose.models.Settings || model('Settings', SettingsSchema);