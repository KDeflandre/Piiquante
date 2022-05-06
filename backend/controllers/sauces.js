exports.getSauce = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));  
  console.log('Sauce récupérée'); 
};

exports.getSauceId = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}));  
  console.log('Sauce particulière récupérée'); 
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
  console.log('Sauce initialisée');
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

