import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const connectToDB = async () => {
	try {
        const client = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB : ", client.connection.host);
	} catch (err) {
		console.log(err);
		return;
	}
};

export default connectToDB;