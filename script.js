const search = document.querySelector('#search'),
    submit = document.querySelector('#submit'),
    ramdom = document.querySelector('#random'),
    mealsEl = document.querySelector('#meals'),
    resultHeading = document.querySelector('#result-heading'),
    single_mealEl = document.querySelector('#single-meal')
// 
const searchMeal = (e) => {
    e.preventDefault();
    single_mealEl.innerHTML = '';
    const term = search.value
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2> Search results for ${term}:</h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = '<p> No search results. Try again</p>'
                }
                else {
                    mealsEl.innerHTML = data.meals.map(meal =>
                        `<div class="meal" ><img src ="${meal.strMealThumb}" alt="${meal.strMeal}"/> 
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                       </div>
                       </div>`
                    ).join('')

                }
            })
        search.value = ('')
    }
    else {
        alert('Please enter a search term')
    }
}
//  fetch meal by ID


const getMealById = (mealID) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        });
}

const addMealToDom = (meal) => {
    const ingredients = [];
    for (let i = 1; 1 <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }
    single_mealEl.innerHTML = `
<div class="single-meal">
<h1>${meal.strMeal}</h1>
<img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
<div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
</div>
<div class = "main" > 
<p> ${meal.strInstructions}</p>
<h2>Ingredients</h2>

</div>
<ul>
${ingredients.map(ing => `<li>${ing}</li>`).join('')}
</ul>
</div>
</div>
`;
}

submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {

    // path is supported in chrome but not in firefox
    const path = e.path || (e.composedPath && e.composedPath());

    const mealInfo = path.find(item => {
        if (item.classList) { return item.classList.contains('meal-info') }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID')
        getMealById(mealID)
        console.log(mealID)
    }
});