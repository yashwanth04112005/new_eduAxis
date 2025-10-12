// Handle file upload for assignments
// Fetch and populate class dropdown
async function populateClassDropdown() {
    try {
        const response = await fetch('/classes');
        const classes = await response.json();
        const classSelect = document.getElementById('className');

        // Clear existing options
        classSelect.innerHTML = '<option value="">Select a class</option>';

        // Add classes to dropdown
        classes.forEach(classItem => {
            const option = document.createElement('option');
            option.value = classItem.className;
            option.textContent = classItem.className;
            classSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading classes:', error);
        UIkit.notification({
            message: 'Error loading classes',
            status: 'danger'
        });
    }
}

// Call this when the modal opens
document.getElementById('addAssignmentModal').addEventListener('beforeshow', populateClassDropdown);

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const subject = document.getElementById('subject');
    const instructions = document.getElementById('instructions');
    const className = document.getElementById('className');
    const deadlineDate = document.getElementById('deadlineDate');
    const deadlineTime = document.getElementById('deadlineTime');
    const unitIdInput = document.getElementById('unitIdInput');

    const file = fileInput.files[0];
    if (!file) {
        UIkit.notification({
            message: 'Please select a file',
            status: 'danger'
        });
        return;
    }

    const formData = new FormData();
    const more = {
        subject: subject.value,
        description: instructions.value,
        className: className.value,
        deadlineDate: deadlineDate.value,
        deadlineTime: deadlineTime.value
    };

    formData.append('file', file);
    formData.append('more', JSON.stringify(more));
    formData.append('unitId', unitIdInput.value);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.status === 201) {
            UIkit.notification({
                message: 'Assignment uploaded successfully!',
                status: 'success'
            });
            UIkit.modal('#addAssignmentModal').hide();
            document.getElementById('uploadForm').reset();
            location.reload();
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        UIkit.notification({
            message: 'Error uploading assignment: ' + error.message,
            status: 'danger'
        });
    }
}

// Handle announcement creation
async function saveAnnouncement(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const details = document.getElementById('details').value;
    const unitId = document.getElementById('unitIdInput').value;

    try {
        const response = await fetch('/unit/announcement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                details: details,
                unitId: unitId
            })
        });

        if (response.ok) {
            UIkit.notification({
                message: 'Announcement created successfully!',
                status: 'success'
            });
            UIkit.modal('#addAnnouncementModal').hide();
            document.getElementById('announcementForm').reset();
            location.reload();
        } else {
            throw new Error('Failed to create announcement');
        }
    } catch (error) {
        UIkit.notification({
            message: 'Error creating announcement: ' + error.message,
            status: 'danger'
        });
    }
}

// Assignment submission handling
var currentAssignmentId = null; // Changed to var and moved to top

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Reset the form when modal is hidden
    UIkit.util.on('#submission-modal', 'hidden', function() {
        document.getElementById('submission-form').reset();
    });
});

function openSubmissionModal(assignmentId) {
    currentAssignmentId = assignmentId;
    UIkit.modal('#submission-modal').show();
}

async function submitAssignment() {
    const form = document.getElementById('submission-form');
    const formData = new FormData(form);

    try {
        const response = await fetch(`/submit-assignment/${currentAssignmentId}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            UIkit.notification({
                message: data.message,
                status: 'success'
            });
            UIkit.modal('#submission-modal').hide();
            setTimeout(() => window.location.reload(), 1000);
        } else {
            UIkit.notification({
                message: data.error || 'Error submitting assignment',
                status: 'danger'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        UIkit.notification({
            message: 'Error submitting assignment',
            status: 'danger'
        });
    }
}

// Grade submission handling
function openGradeModal(submissionId, currentGrade = '', currentFeedback = '') {
    document.getElementById('submission-id').value = submissionId;
    document.getElementById('grade-input').value = currentGrade;
    document.getElementById('feedback-input').value = currentFeedback;
    UIkit.modal('#grade-modal').show();
}

// Setup grade form submission when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const gradeForm = document.getElementById('grade-form');
    if (gradeForm) {
        gradeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submissionId = document.getElementById('submission-id').value;
            const grade = document.getElementById('grade-input').value;
            const feedback = document.getElementById('feedback-input').value;

            try {
                const response = await fetch(`/grade-submission/${submissionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ grade, feedback })
                });

                const data = await response.json();
                
                if (response.ok) {
                    UIkit.notification({
                        message: 'Grade submitted successfully',
                        status: 'success'
                    });
                    UIkit.modal('#grade-modal').hide();
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    UIkit.notification({
                        message: data.error || 'Error submitting grade',
                        status: 'danger'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                UIkit.notification({
                    message: 'Error submitting grade',
                    status: 'danger'
                });
            }
        });
    }
});