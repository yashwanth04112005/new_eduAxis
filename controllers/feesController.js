const FeesStructure = require("../models/feesModel");
const FeeReceipt = require("../models/feeReceiptModel");
const multer = require("multer");
const fs = require("fs");

async function deleteFile(filePath) {
	return new Promise((resolve) => {
		fs.unlink(filePath, (err) => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}

const feesStorage = multer.diskStorage({
	destination: (req, res, cb) => {
		const feesDir = "FeesStructures";
		if (!fs.existsSync(feesDir)) {
			fs.mkdirSync(feesDir);
		}
		cb(null, feesDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}_${file.originalname}`;
		cb(null, uniqueName);
	},
});

const receiptStorage = multer.diskStorage({
	destination: (req, res, cb) => {
		const receiptsDir = "FeeReceipts";
		if (!fs.existsSync(receiptsDir)) {
			fs.mkdirSync(receiptsDir);
		}
		cb(null, receiptsDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}_${file.originalname}`;
		cb(null, uniqueName);
	},
});

const upload = multer({
	storage: feesStorage,
	fileFilter: (req, file, cb) => {
		const validTypes = [
			"text/plain",
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		];
		if (validTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type"), false);
		}
	},
});

const uploadReceipt = multer({
	storage: receiptStorage,
	fileFilter: (req, file, cb) => {
		const validTypes = [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/jpg",
		];
		if (validTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid receipt file type"), false);
		}
	},
});
const fees = {
	upload: upload,
	uploadReceipt: uploadReceipt,
	save: async (fieldname, filePath, creator) => {
		try {
			const newStructure = new FeesStructure({
				title: fieldname,
				fileLocation: filePath,
				creator: creator,
			});
			const savedStructure = await newStructure.save();
			if (!savedStructure.error) {
				return true;
			} else {
				throw new Error("Fees Structure Not Saved");
			}
		} catch (error) {
			return { error: error.message };
		}
	},
	saveReceipt: async (studentId, filePath, amount) => {
		try {
			const newReceipt = new FeeReceipt({
				student: studentId,
				receiptFile: filePath,
				amount: amount,
			});
			const savedReceipt = await newReceipt.save();
			if (!savedReceipt.error) {
				return true;
			} else {
				throw new Error("Fee Receipt Not Saved");
			}
		} catch (error) {
			return { error: error.message };
		}
	},
	getTotalReceiptsAmount: async () => {
		try {
			const receipts = await FeeReceipt.find({});
			const total = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
			return total;
		} catch (error) {
			return { error: error.message };
		}
	},
	delete: async (feesStructureId) => {
		try {
			const deletedStructure = await FeesStructure.findByIdAndDelete(
				feesStructureId
			);
			const deletedActualFile = await deleteFile(deletedStructure.fileLocation);
			if (!deletedStructure.error) {
				return true;
			} else {
				throw new Error("File Not Deleted!");
			}
		} catch (error) {
			return { error: error.message };
		}
	},
	list: async () => {
		try {
			const theFeesStructureList = await FeesStructure.find({});
			return theFeesStructureList;
		} catch (error) {
			return { error: error.message };
		}
	},
	getPath: async (feesStructureId) => {
		try {
			const foundFeesStrucutre = await FeesStructure.findById(
				{ _id: feesStructureId },
				{ fileLocation: true }
			);
			if (!foundFeesStrucutre.error && foundFeesStrucutre) {
				return foundFeesStrucutre.fileLocation;
			} else {
				throw new Error("Fees Structure Not Found!");
			}
		} catch (error) {
			return { error: error.message };
		}
	},
};
module.exports = fees;
