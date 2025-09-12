const message = {
	save: async (User, theTitle, studentId) => {
		try {
			const updatedStudent = await User.findByIdAndUpdate(
				studentId,
				{
					$push: {
						messages: { title: theTitle, read: false, createdAt: new Date() }, // added createdAt
					},
				},
				{ new: true } // This option returns the updated document
			);
			if (updatedStudent) {
				return true;
			} else {
				throw new Error("Message Not Saved!");
			}
		} catch (error) {
			return { error: error.message };
		}
	},
	// new: return all messages newest first
	getMessages: async (User, studentId) => {
		try {
			const user = await User.findById(studentId).lean();
			if (!user) return { error: "User not found" };
			const msgs = Array.isArray(user.messages) ? user.messages : [];
			// sort descending by createdAt (newest first)
			msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			return msgs;
		} catch (error) {
			return { error: error.message };
		}
	},
	markAsRead: async (User, studentId) => {
		try {
			const updatedStudent = await User.updateOne(
				{ _id: studentId },
				{ $set: { "messages.$[].read": true } } // $[] updates all elements in the array
			);
			return updatedStudent.modifiedCount > 0; // Return true if at least one document was modified
		} catch (error) {
			return { error: error.message };
		}
	},

	deleteAll: async (User, studentId) => {
		try {
			const updatedStudent = await User.findByIdAndUpdate(
				{ _id: studentId },
				{ $set: { messages: [] } },
				{ new: true }
			);
			return true;
		} catch (error) {
			return { error: error.message };
		}
	},
};
module.exports = message;
