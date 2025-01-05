"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (uri) => {
    if (mongoose_1.default.connection.readyState === 0) {
        await mongoose_1.default.connect(uri);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.connection.close();
    }
};
exports.disconnectDB = disconnectDB;
