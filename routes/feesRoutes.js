const router = require("express").Router();
const flash = require("connect-flash");
const fees = require("../controllers/feesController");
const path = require("path");
// MIDDLEWARES

router.use(flash());

router
	.post("/upload", fees.upload.single("feesStructure"), async (req, res) => {
		try {
			const { file } = req;
			const { originalname, path } = file;
			const creator = req.user.username;

			const savedStructure = await fees.save(originalname, path, creator);
			if (!savedStructure.error) {
				req.flash("info", "Fees Structure Saved Successfully!");
			} else {
				req.flash("info", savedStructure.error);
			}

			res.redirect("/dashboard");
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error uploading file", error: error.message });
		}
	})

	// Submit fee receipt (student)
	.post("/submit-receipt", fees.uploadReceipt.single("feeReceipt"), async (req, res) => {
		try {
			const { file } = req;
			const { amount } = req.body;
			const studentId = req.user._id;
			if (!file || !amount) {
				return res.status(400).json({ error: "Receipt file and amount required" });
			}
			const savedReceipt = await fees.saveReceipt(studentId, file.path, Number(amount));
			if (!savedReceipt.error) {
				req.flash("info", "Fee Receipt Submitted Successfully!");
			} else {
				req.flash("info", savedReceipt.error);
			}
			res.redirect("/dashboard");
		} catch (error) {
			res.status(500).json({ message: "Error submitting receipt", error: error.message });
		}
	})

	// Get total receipts amount (admin)
	.get("/total-receipts-amount", async (req, res) => {
		try {
			const total = await fees.getTotalReceiptsAmount();
			res.json({ total });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	})
	.get("/delete/:id", async (req, res) => {
		const { id } = req.params;
		const deletedStructure = await fees.delete(id);
		if (!deletedStructure.error) {
			req.flash("info", "Fees Structure Deleted Successfully!");
		} else {
			req.flash("info", deletedStructure.error);
		}
		res.redirect("/dashboard");
	})
	.get("/download/:id", async (req, res) => {
		try {
			const { id } = req.params;
			const structureFilePath = await fees.getPath(id);
			if (!structureFilePath.error) {
				const filePath = path.resolve(structureFilePath);
				res.download(filePath, (err) => {
					if (err) {
						console.error("Error downloading file", err);
						return res.status(500).json({ error: "Error downloading file" });
					}
				});
			}
		} catch (err) {
			console.error("Error fetching assignment", err);
			res.status(500).json({ error: "Server error" });
		}
	});
module.exports = router;
