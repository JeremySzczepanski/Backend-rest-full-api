const jwt = require('jsonwebtoken');



module.exports = (req, res, next)=>{

	try {
								//On récupère le token qu'on a dans la requête, il y a une méthode qui permet de récupèrer l'entête de la requête avec un attribut "authorization (req.headers.authoorization)
		const token = req.headers.authorization.split(' ')[1];		//nous fourni un string que nous allons découper avec l'espace ' ', ce que nous aurons de l'autre coté [1] sera le token
									//On vérifie si le token est valide, s'il est bien généré par le serveur...
		const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);	//la méthode vérify permet de vérifier un token 
											//(est ce que c'est délivré par le serveur, est ce qu'il est valide, etc..) si err on catch
											//verify prend en paramètre le token et la clé secrete
		
								//On regarde le cas où le token est envoyé mais l'identifiant de l'utilisateur est également envoyé dans la requête
								//Dans ce cas là on doit également vérifier si l'identifiant envoyé dans la requête est conforme à l'identifiant qu'on a dans le token
								//Sinon on va également retourner une erreur
		if(req.body.userId && req.body.userId !== decodeToken.userId){
			return res.status(401).json({
				status: 401,
				message: 'Invalid user ID'
			})
		}else{						//Si le userId de la requête est égal au userId du token décodé, on peut passer au middleware suivant
			next()
		}


	} catch (err) {						//chaque fois qu'on aura des exceptions, on va retourner ceci
		return res.status(500).json({
			status: 500,
			message: err.message
		})
	}
}