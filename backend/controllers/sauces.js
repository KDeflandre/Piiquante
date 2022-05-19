const Sauce = require('../models/Sauce');
const fs = require('fs'); 

exports.getSauce = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));  
  console.log('Sauce récup'); 
};

exports.getSauceId = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));  
  console.log('Sauce spé récup'); 
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
  .then(() => res.status(201).json({message: "Sauce ajoutée"}))
  .catch(error => res.status(400).json({error}));
  console.log('Sauce ajoutée');
};

exports.modifySauce = (req, res ,next) => {
  const sauceObject = req.file ?
  {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(() => res.status(200).json({message: 'Sauce modifiée'}))
  .catch(error => res.status(400).json({error}));  
  console.log('Sauce modifiée'); 
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce supprimée'}))
          .catch(error => res.status(400).json({error}));  
          console.log('Sauce supprimée'); 
      });
  })
  .catch(error => res.status(500).json({error}));
};

// Like et Dislike les sauces + annuler son vote
exports.likeSauce = (req, res, next) => {
  
  //Recup de la sauce avec params.id
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log("Infos sauce");
      console.log(sauce);

      // Like
      if (req.body.like === 1) {
        if (!sauce.usersLiked.includes(req.body.userId)) {
    
          // MAJ BDD
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
              $push: { usersLiked : req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Sauce liké ! " }))
            .catch((error) => res.status(400).json({ error }));
        }

        // Dislike
      } else if (req.body.like === -1) {
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          
          // MAJ BDD
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Vous n'appreciez pas cette sauce ? " }))
            .catch((error) => res.status(400).json({ error }));
        }
      } else if (req.body.like === 0) {
        
        // Take off Like / Dislike
        if (sauce.usersLiked.includes(req.body.userId)) {
          
          // MAJ BDD
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Pas encore testé cette sauce ?" }))
            .catch((error) => res.status(400).json({ error }));
        
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
          
          // MAJ BDD
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Pas encore testé cette sauce ?" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

