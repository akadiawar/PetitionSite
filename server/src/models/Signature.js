const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signedAt: {
    type: Date,
    default: Date.now
  }
});

// 한 사용자가 같은 청원에 중복 서명 방지
signatureSchema.index({ petition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Signature', signatureSchema);
