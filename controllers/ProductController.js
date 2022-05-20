let ProductModel = require('../models/ProductModel.js');
const fs = require('fs');


/**
 * ProductController.js
 * @description :: Server-side logic for managing Products.
 */
module.exports = {
	list: (req, res)=>{
		ProductModel.find((err, products)=>{
		if(err){
			return res.status(500).json({
				status: 500,
				message: 'Error when getting Product.'
			})
		}
		return res.status(200).json({				//Si tout se passe bien on retourne le code status 200
			status: 200,
			result: products				//le premier products est la clé, le second ce qu'on récupére dans ProductModel.find
	    })
        })
    },


    show: (req, res)=>{
        const id = req.params.id;
        ProductModel.findOne({_id: id}, (err, product)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when getting Product.'
                })
            }
            if(!product){			//On regarde si on a rééllement un produit en retour
                return res.status(404).json({
                    status: 404,
                    message: 'No such Product'
                })
            }
            return res.status(200).json({				//On a bien retrouvé le produit
                status: 200,
                result: product
            })
        })
    },

    create: (req, res)=>{
        if(!req.file){
            return res.status(500).json({
                status: 500,
                message: 'Product Image Required'
            })
        }
        const product = JSON.parse(req.body.product);	//ICI ON TRANSFORME LE JSON RECU EN JAVASCRIPT
        delete product._id;				//On supprime l'id reçu dans l'objet product, afin que mongodb en génére un
    
        let Product = new ProductModel({
            ...product,										//ICI on utilise product
            image : `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`
        })

        Product.save((err, Product)=>{
            if(err){
                return res.status(500).json({
                    message: 'Error when creating Product',
                    error: err
                });
            }
            return res.status(201).json({		
                status: 201,
                message: 'Product Created'
            })
        })
    },

    update: (req, res)=>{
        const id = req.params.id;
        let product = JSON.parse(req.body.product);		//On a ici l'objet product qui a toutes les informations en son sein
                                    //On met a jour l'attribut image, si l'utilisateur venait à changer l'image
        if(req.file){						//on ne met pas req.body.product.image, car on ne sait pas encore le nom que l'image aura, on passe par multer qui change le nom
            product.image = `${req.protocol}://${req.get('host')}/images/products/${req.file.filename}`	
                                    //On supprime l'ancienne image qui est déjà sur le backend
                                    //On prend l'identifiant du produit qu'on a reçu en paramètres, et on fait une projection pour dire qu'on ne peut pas tous les champs mais juste le champ image
            ProductModel.findOne({_id: id}, {image: true}, (err, product)=>{
                if(err){
                    console.log(err);
                    return;	
                }
                                    //Si pas d'erreur on récupère le nom du fichier et on procède à sa suppression
                const filename = product.image.split('/products/')[1];
                fs.unlink(`public/images/products/${filename}`, (err)=>{
                    if(err){
                        console.log(err.message);
                    }
                });
            })
        }
                                    //ICI on a un produit qui est prêt à être sauvegardé.
                                    //on ajoute _id: id après ...product afin de modifier l'identifiant qu'on a reçu dans l'objet du frontend.
        ProductModel.updateOne({_id: id}, {...product, _id: id}, (err, data)=>{		//"data" dans le call back, comme l'objet récupéré
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when updating Product',
                    error: err
                })
            }
            
            return res.status(200).json({
                status: 200,
                message: 'Product Updated !'
            })
        })	
    
    },	

    remove: (req, res)=>{
        const id = req.params.id;
        ProductModel.findByIdAndRemove(id, (err, Product)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when deleting Product',
                    error: err
                });
            }
            if(!Product){
                return res.status(404).json({
                    status: 404,
                    message: 'No Such Product !'
                })
            }
            const Filename = Product.image.split('/products/')[1];	 //On supprime le fichier lié au produit.
            fs.unlinkSync(`public/images/products/${Filename}`);		
    
            return res.status(204).json();
        })
    }
}





