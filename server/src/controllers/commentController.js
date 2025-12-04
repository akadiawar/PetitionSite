const Comment = require('../models/Comment');
const Petition = require('../models/Petition');

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { petitionId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // 인증 미들웨어에서 추출

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력하세요' });
    }

    // 청원이 존재하는지 확인
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: '청원을 찾을 수 없습니다' });
    }

    // 댓글 생성
    const comment = new Comment({
      petition: petitionId,
      author: userId,
      content
    });

    await comment.save();

    // 사용자 정보와 함께 반환
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.status(201).json({
      message: '댓글이 작성되었습니다',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 특정 청원의 모든 댓글 조회
exports.getCommentsByPetition = async (req, res) => {
  try {
    const { petitionId } = req.params;

    const comments = await Comment.find({ petition: petitionId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 }); // 최신 댓글 먼저

    res.json({
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
    }

    // 작성자 본인만 삭제 가능
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: '댓글이 삭제되었습니다' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력하세요' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
    }

    // 작성자 본인만 수정 가능
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다' });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(commentId)
      .populate('author', 'name email');

    res.json({
      message: '댓글이 수정되었습니다',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
