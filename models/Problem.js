import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'Medium', 'Hard'],
        required: true,
        default: 'easy'
    },
    testcases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],
    codeStubs: [
        {
            language: {
                type: String,
                enum: ['CPP', 'JAVA', 'PYTHON'],
                required: true
            },
            startSnippet: { type: String },
            endSnippet: { type: String },
            userSnippet: { type: String }
        }
    ],
    editorial: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;