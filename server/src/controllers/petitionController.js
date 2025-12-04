const Petition = require('../models/Petition');

// 모든 청원 조회
exports.getAllPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 청원 상세 조회
exports.getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('author', 'name email');
    if (!petition) {
      return res.status(404).json({ message: '청원을 찾을 수 없습니다' });
    }
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 청원 생성
exports.createPetition = async (req, res) => {
  try {
    const { title, content, category, endDate, targetSignatures } = req.body;
    const petition = new Petition({
      title,
      content,
      category,
      author: req.user.id, // 인증 미들웨어에서 설정됨
      endDate,
      targetSignatures
    });
    await petition.save();
    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 청원 수정
exports.updatePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: '청원을 찾을 수 없습니다' });
    }
    
    // 작성자만 수정 가능
    if (petition.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    Object.assign(petition, req.body);
    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 청원 삭제
exports.deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: '청원을 찾을 수 없습니다' });
    }
    
    if (petition.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    await petition.deleteOne();
    res.json({ message: '청원이 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
