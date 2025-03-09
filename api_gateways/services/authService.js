const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');
const dotenv = require('dotenv');


dotenv.config();

class AuthServices{

    static generateToken(user){
        return jwt.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN}
        );
    }

    static async registerUser(name, email, password){
        try{
            // check if the user exists
            let existingUser = await User.findOne({where: {email}});
            if(existingUser){
                throw new Error('User already exists');
            }
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create user
            const user = await User.create({
                name, 
                email,
                password: hashedPassword
            });

            return {message: 'User created successfully', user};
        }catch(error){
            throw new Error(error.message);
        }
    }
    static async loginUser(email, password){
        try{ 
            const user = await User.findOne({where: {email}});
            if(!user){
                throw new Error('Invalid credentials');
            }

            // compare password
            const isMatch = await bcrypt.compare(password, user.passwords);
            if(!isMatch){
                throw new Error('Invalid credentials');
            }

            const token = this.generateToken(user);
            return {
                token,
                user : {id: user.id, name: user.name, email: user.email}
            };
        }catch(error){
            throw new Error(error.message);
        }
    }
}

module.exports = AuthServices;
