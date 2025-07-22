// backend/controllers/submissionController.js
const Submission = require('../models/Submission.js');
const Problem = require('../models/Problem.js');
const axios = require('axios');

exports.createSubmission = async (req, res) => {
    const { language, code, problemId } = req.body;
    const userId = req.user._id;

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // For simplicity, we'll test against the first hidden test case.
        // A full implementation would loop through all of them.
        const testCase = problem.hiddenTestCases[0];
        if (!testCase) {
            return res.status(400).json({ message: 'No test cases found for this problem' });
        }

        // Call the runner service
        const runnerResponse = await axios.post('http://localhost:7777/run', {
            language,
            code,
            input: testCase.input,
        });

        const { verdict: runnerVerdict, output, error } = runnerResponse.data;
        let finalVerdict = runnerVerdict;

        // Determine final verdict
        if (runnerVerdict === 'OK') {
            // Trim whitespace from both outputs before comparing
            if (output.trim() === testCase.output.trim()) {
                finalVerdict = 'Accepted';
            } else {
                finalVerdict = 'Wrong Answer';
            }
        } else {
            // Map runner verdicts to our submission verdicts
            if (runnerVerdict === 'RE') finalVerdict = 'Runtime Error';
            if (runnerVerdict === 'TLE') finalVerdict = 'Time Limit Exceeded';
            if (runnerVerdict === 'CE') finalVerdict = 'Compilation Error';
        }

        // Save the submission to the database
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            verdict: finalVerdict,
            output: output || error,
        });

        res.status(201).json({ verdict: finalVerdict, output: output || error });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProblemSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            userId: req.user._id,
            problemId: req.params.problemId
        }).sort({ createdAt: -1 }); // Sort by most recent

        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};





// Add this function to backend/controllers/submissionController.js

exports.runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;
    try {
        // Directly call the runner service with the provided data
        const runnerResponse = await axios.post('http://localhost:7777/run', {
            language,
            code,
            input,
        });
        // Send the raw response from the runner back to the client
        res.json(runnerResponse.data);
    } catch (err) {
        console.error('RUNNER CALL FAILED:', err.message); 
        res.status(500).json({ 
            message: 'Error executing code', 
            error: err.response ? err.response.data : err.message 
        });
    }
};




// At the bottom of submissionController.js
// module.exports = { createSubmission, getProblemSubmissions };