const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// 댓글 작성 (인증 필요)
router.post('/:petitionId', auth, commentController.createComment);

// 특정 청원의 댓글 조회 (인증 불필요)
router.get('/:petitionId', commentController.getCommentsByPetition);

// 댓글 수정 (인증 필요)
router.put('/:commentId', auth, commentController.updateComment);

// 댓글 삭제 (인증 필요)
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
