const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

module.exports = {
	signup: (req, res)=>{
		bcrypt.hash(req.body.password, 10, (err, hash)=>{
			if(err){
				return res.status(500).json({
					status: 500,
					message: err.message
				})
			}
			const newUser = new User({			//On récupère son email et son password
				email: req.body.email,
				password: hash
			})
			
									//On l'enregistre
			newUser.save((err, user)=>{
				if(err){
					return res.status(400).json({
						status: 400,
						message: err.message
					})
				}
				return res.status(201).json({					//Si pas d'erreur on affiche que tout s'est bien passé
					status: 201,
					message: 'User created !'
				})
			})
		})					
	},

    login: (req, res)=>{
        User.findOne({email: req.body.email}, (err, user)=>{			
            if(err){
                return res.status(500).json({							//Si on a une erreur ici, c'est qu'il s'agit d'une erreur du serveur
                    status: 500,
                    message: err.message
                });	
            }
            if(!user){										//ICI on traite le cas de l'email inconnu
                return res.status(404).json({
                    status: 404,
                    message: 'User not found !'
                });
            }
    
            bcrypt.compare(req.body.password, user.password, (err, valid)=>{	
                                            
                if(err){
                    return res.status(500).json({
                        status: 500,
                        message: err.message
                    });
                }
                if(!valid){		//Si verif retourne false
                    return res.status(401).json({
                        status: 401,
                        message: "Wrong Password !"
                    });
                
                }
                                            //Tout ok l'utilisateur à le droit d'être connecté
                return res.status(200).json({
                    userId: user._id,				//le user est déjà celui qu'on a récupéré dans findOne, et on génére un token
                    token: jwt.sign(				//voir doc JWT, sign permet de créer un token
                        {userId: user._id},			//On sauvegarde dans le token l'identifiant de l'utilisateur
                        process.env.TOKEN_SECRET,		//On aura besoin de cette clé pour décoder le token
                        {expiresIn: '24h'}			//La date d'expiration du token
                    )
                })
    
    
            })
        })
    
    }
}