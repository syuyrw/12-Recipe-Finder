let ingredients = [];
let measurements = [];
let name = document.getElementById("name");
let ingredientList = document.getElementById("ingredient-list");
const $ = (id) => document.getElementById(id);

$("search-btn").addEventListener("click", getMealData);
$("dish-name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getMealData();
});

// Function to pull API and parse it.
function getMealData() {
    let dishName = document.getElementById("dish-name").value.trim();

    // Trim input, and ensure there is something other than spaces typed

    if (dishName.trim() === "") {
        alert("Please enter a dish name.");
        return;
    }

    // Clear arrays
    ingredients.length = 0;
    measurements.length = 0;

    const options = { method: "GET", headers: { accept: "application/json" } };
    fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`,
        options
    )
        // Parse data
        .then((response) => response.json())
        .then((data) => {
            if (data.meals && data.meals.length > 0) {
                console.log(data.meals[0]);

                const meal = data.meals[0];
                // Add ingredients from object to ingredients array
                for (const key in meal) {
                    if (key.startsWith("strIngredient") && meal[key]) {
                        ingredients.push(meal[key]);
                    }
                }

                // Add measurements from object to measurements array
                for (const key in meal) {
                    if (
                        key.startsWith("strMeasure") &&
                        meal[key] &&
                        meal[key] != " "
                    ) {
                        measurements.push(meal[key]);
                    }
                }

                ingredientMeasure(ingredients, measurements);
                showRecipe(meal);
                listInstructions(meal);
                thumbnail(meal);
                document.getElementById("steps").style.display = "block";
                document.getElementById("ingredients-area").style.display =
                    "block";
                document.getElementById("steps-area").style.display = "block";
                // console.log(measurements);

                //console.log(instructions);
            } else {
                console.error("Invalid dish name or no results found");
                alert("Dish not found. Try another.");
            }

            $("dish-name").value = "";
        })
        .catch((err) => console.error(err));

    // console.log(ingredients);
}

// Function to list ingredients with their measurement
function ingredientMeasure(arr1, arr2) {
    document.getElementById("ingredients").style.display = "block";
    const minLength = Math.min(arr1.length, arr2.length);

    ingredientList.innerHTML = "";

    for (let i = 0; i < minLength; i++) {
        let ingredient = arr1[i];
        let capitalized =
            ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

        let li = document.createElement("li");
        li.appendChild(document.createTextNode(`${capitalized}: ${arr2[i]}`));
        ingredientList.appendChild(li);
    }
    ingredientList.style.display = "block";
}

// Function to create list of steps
function listInstructions(meal) {
    const instructionsBefore = meal.strInstructions;
    const instructions = instructionsBefore.replace(/\. /g, ". <br><br>");
    const instructionArea = document.getElementById("steps-para");
    instructionArea.innerHTML = instructions;
    instructionArea.style.display = "block";
}

// Function to display the whole recipe
function showRecipe(meal) {
    // Display recipe name
    name.textContent = meal.strMeal;
    name.style.display = "block";
}

// Function to display the thumbnail
function thumbnail(meal) {
    let imgSrc = meal.strMealThumb;
    document.getElementById("thumb").src = imgSrc;
}

// getMealData();
