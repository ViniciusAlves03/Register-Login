const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController {
    static async register(req, res) {

        const { name, email, phone, password, confirmPassword } = req.body

        // Checking if the user has entered all the information
        if(!name){res.status(422).json({message: "o nome é obrigatório!"}); return}
        if(!email){res.status(422).json({message: "o e-mail é obrigatório!"}); return}
        if(!phone){res.status(422).json({message: "o número de telefone é obrigatório!"}); return}
        if(!password){res.status(422).json({message: "a senha é obrigatória!"}); return}
        if(!confirmPassword){res.status(422).json({message: "a confirmação de senha é obrigatória!"}); return}

        // Checking if password and password confirmation are different
        if (password !== confirmPassword){
            res.status(422).json({message: "A senha e a confimação de senha precisam ser iguais!"})
        }

        // Checking if there is a user with the same registered email
        const userExists = await User.findOne({email: email})

        if (userExists){
            res.status(422).json({message: "E-mail já cadastrado, utilize um outro e-mail!"})
        }

        // Manipulating the password with bcrypt
        const salt = await bcrypt.genSalt(12)
        const passswordHash = await bcrypt.hash(password, salt)

        const user = new User({ name, email, phone, password: passswordHash })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {

        return
    }
}
