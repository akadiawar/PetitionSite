const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['진행중', '종료', '답변완료'],
    default: '진행중'
  },
  signatureCount: {
    type: Number,
    default: 0
  },
  targetSignatures: {
    type: Number,
    default: 100
  },
  endDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Petition', petitionSchema);
