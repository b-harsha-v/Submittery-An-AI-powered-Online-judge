const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.post('/run', (req, res) => {
    const { language = 'python', code, input = '' } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required.' });
    }

    const jobId = uuid();
    const jobDir = path.join(tempDir, jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    const filenames = { cpp: 'main.cpp', python: 'main.py', java: 'Main.java' };
    const filePath = path.join(jobDir, filenames[language]);
    fs.writeFileSync(filePath, code);

    const baseImage = `submittery-${language}-base`;
    const runCommands = {
        cpp: `g++ main.cpp -o main && ./main`,
        python: `python main.py`,
        java: `javac Main.java && java Main`
    };

    const command = 'docker';
    const args = [
        'run', '--rm', '-i',
        '--memory', '256m',
        '--cpus', '0.5',
        '-v', `${jobDir}:/usercode`, // Mount the user's code
        baseImage,                  // Use the pre-built base image
        'sh', '-c', runCommands[language] // Execute the run/compile command
    ];

    const startTime = process.hrtime();
    const child = spawn(command, args);
    const timeout = 10000; // 10 seconds

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
        child.kill('SIGKILL');
    }, timeout);

    child.stdin.write(input);
    child.stdin.end();

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    child.on('close', (code, signal) => {
        clearTimeout(timer);
        const endTime = process.hrtime(startTime);
        const executionTime = endTime[0] * 1000 + endTime[1] / 1000000;

        fs.rm(jobDir, { recursive: true, force: true }, () => {});

        if (signal === 'SIGKILL') {
            return res.json({ verdict: 'TLE', error: 'Time Limit Exceeded', executionTime });
        }
        if (code !== 0) {
            return res.json({ verdict: 'RE', error: stderr, output: stdout, executionTime });
        }
        res.json({ verdict: 'OK', output: stdout, stderr, executionTime });
    });
});

const PORT = 7777;
app.listen(PORT, () => {
    console.log(`Runner server listening on port ${PORT}`);
});