import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const uri: string = process.env.MONGODB_URI ?? "mongodb://localhost:27017/qr-swiftfood";
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error: unknown) {
        if (error instanceof mongoose.Error) {
            console.error('Mongoose Error:', error.message);
        } else if (error instanceof Error) {
            console.error('General Error:', error.message);
        } else {
            console.error('Unexpected Error:', JSON.stringify(error));
        }
    }
};

export default connectDB;
