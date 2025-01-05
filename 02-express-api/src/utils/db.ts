import mongoose from 'mongoose';

const connectDB = async (uri: string) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
};

const disconnectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
};

export { connectDB, disconnectDB };
