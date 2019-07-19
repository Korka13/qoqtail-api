const fetch = require("node-fetch");

require('dotenv').config();

const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/';
const apiKey = process.env.API_KEY;
const apiSearchByName = '/search.php?s='
const apiGetById = '/lookup.php?i='

const organizeQoqtail = (responseCocktails) => {
  if(responseCocktails === null){
    return null
  }
  return responseCocktails.map(cocktail => {
    return {
      id: cocktail.idDrink,
      name: cocktail.strDrink,
      image: cocktail.strDrinkThumb,
      glass: cocktail.strGlass,
      instructions: cocktail.strInstructions,
      ingredients: [
        [cocktail.strIngredient1, cocktail.strMeasure1],
        [cocktail.strIngredient2, cocktail.strMeasure2],
        [cocktail.strIngredient3, cocktail.strMeasure3],
        [cocktail.strIngredient4, cocktail.strMeasure4],
        [cocktail.strIngredient5, cocktail.strMeasure5],
        [cocktail.strIngredient6, cocktail.strMeasure6],
        [cocktail.strIngredient7, cocktail.strMeasure7],
        [cocktail.strIngredient8, cocktail.strMeasure8],
        [cocktail.strIngredient9, cocktail.strMeasure9],
        [cocktail.strIngredient10, cocktail.strMeasure10],
        [cocktail.strIngredient11, cocktail.strMeasure11],
        [cocktail.strIngredient12, cocktail.strMeasure12],
        [cocktail.strIngredient13, cocktail.strMeasure13],
        [cocktail.strIngredient14, cocktail.strMeasure14],
        [cocktail.strIngredient15, cocktail.strMeasure15],
      ]
    }
  })
}

const searchByName = () => (req, res) => {
  fetch(apiUrl + apiKey + apiSearchByName + req.params.keyword)
    .then(response => response.json())
    .then(response => organizeQoqtail(response.drinks))
    .then(response => res.json(response))
    .catch(err => console.log(err));
}

const getQoqtails = () => (req, res) => {
  fetch(apiUrl + apiKey + apiGetById + req.params.id)
    .then(response => response.json())
    .then(response => organizeQoqtail(response.drinks))
    .then(response => res.json(response))
    .catch(err => console.log(err));
}

const addQoqtail = (db) => (req, res) => {
  const { id, qoqtailId, name } = req.body;
  db('qoqtails').insert({
    id: qoqtailId,
    user_id: id,
    name: name
  })
  .returning('user_id')
  .then(user => {
    db.select('*').from('qoqtails')
    .where('user_id', '=', user[0])
    .then(qoqtails => {
      res.json(qoqtails);
  })
  .catch(err => res.status(400).json(err))
  })
  .catch(err => res.status(400).json(err))
}

const deleteQoqtail = (db) => (req, res) => {
  const { id, qoqtailId } = req.body;
  db('qoqtails')
  .where({
    id: qoqtailId,
    user_id: id
  }).del()
  .then(() => {
    db.select('*').from('qoqtails')
    .where('user_id', '=', id)
    .then(qoqtails => {
      res.json(qoqtails);
  })
  .catch(err => res.status(400).json(err))
  })
  .catch(err => res.status(400).json(err))
}

module.exports = {
  addQoqtail,
  deleteQoqtail,
  searchByName,
  getQoqtails
}