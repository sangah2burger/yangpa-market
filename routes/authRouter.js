const express = require('express');
const {User} = require('../models');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const upload = require('./uploadImage');

const createHash = async (password, saltRound)=> {
    let hashed = await bcrypt.hash(password, saltRound);
    console.log(hashed);
    return hashed;
}

router.post('/sign-up', upload.single('image'), async(req, res)=> {
    const member = req.body;
    member.profile = req.filename;
    member.password = await createHash(member.password, 10);
    try {
        const result = await User.create(member);
        res.json({ success: true, member: result, message: "회원가입 성공"});
    } catch(err) {
        res.json({ success: false, member: [], message: err.message });
    }
});

router.post('/sign-in', async(req, res)=> {
    const { userID, password } = req.body;
    const options = {
        attributes: ['password', 'profile', 'userID', 'userName'],
        where: { userID: userID}
    }
    const result = await User.findOne(options);
    if(result) {
        const compared = await bcrypt.compare(password, result.password);
        if(compared) {
            const token = jwt.sign({ userID: userID, rol: 'admin' }, secret)
            res.json({success: true,
                token: token,
                member:{
                    userID,
                    "profile": result.profile,
                    "userName" : result.userName
                },
                message: "로그인에 성공했습니다.",
        })
        } else {
            res.json({
                success: false,
                token: '',
                message: '비밀번호가 틀립니다.'});
            }
        } else {
            res.json({ success: false, token: '', message: '존재하지않는 아이디입니다.'});
        }
    });

module.exports = router;
