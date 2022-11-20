var mineArray;
var height;
var width;

function newGame() {
	// Generate a new minefield with a given width and height.

	width = parseInt(document.getElementById("newGameWidth").value);
	height = parseInt(document.getElementById("newGameHeight").value);

	generateMineArray(width, height);

	console.log(mineArray);

	const newTable = document.createDocumentFragment();

	for ( i=0; i< height; i++ ) {

		const row = newTable.appendChild(document.createElement('tr'));

		for ( j=0; j< width; j++ ) {

			const space = row.appendChild(document.createElement("td"));

			space.setAttribute("data-x", j);
			space.setAttribute("data-y", i);

		}

	}

	const minefield = document.getElementById("minefield");
	minefield.style.setProperty("width", (width * 1.7) - 0.2 + "em");
	minefield.replaceChildren(newTable);

	const spaces = document.getElementsByTagName("td");

	for ( i=0; i<spaces.length; i++ ) {

		spaces[i].addEventListener("click", clickSpace);
		spaces[i].addEventListener("click", setFlag);

	}

}

window.oncontextmenu = function ( event ) {
	// Prevent right-click menu on Chrome
	event.preventDefault();
	event.stopPropagation();
	return 0
}

function setFlag( event ) {

	if ( event.button !== 2 ) {
		return
	}

	event.preventDefault();

	const x = event.target.dataset.x;
	const y = event.target.dataset.y;

	const space = getSpaceFromCoords( y, x );

	space.style.setProperty("background", "url(./img/flag.png)");
	space.style.setProperty("background-color", "hsl(0, 0%, 90%)");
	space.style.setProperty("background-size", "cover");
	space.removeEventListener("click", clickSpace);
	space.removeEventListener("click", setFlag);
	space.addEventListener("click", removeFlag);

}

function removeFlag ( event ) {

	if ( event.button !== 2 ) {
		return
	}

	event.preventDefault();

	const x = event.target.dataset.x;
	const y = event.target.dataset.y;

	const space = getSpaceFromCoords( y, x );

	space.style.removeProperty("background");
	space.style.setProperty("background-color", "hsl(0, 0%, 100%)");
	space.addEventListener("click", clickSpace);
	space.addEventListener("click", setFlag);
	space.removeEventListener("click", removeFlag);

}

function generateMineArray ( width, height ) {
	// Generate an array with values for every space of a minefield of a given width and height.

	mineArray = [];

	// Populate an empty 2D array
	for (i=0; i<height; i++) {
		mineArray.push(Array.apply(null, new Array(width)));
	}

	// Fill array with zeros
	iterateSequentially((y, x)=>{

		mineArray[y][x] = 0;

	})

	// Place Mines
	iterateSequentially(placeMines);

}

function placeMines (y, x) {
	// Place a mine in a space based on random chance.

// Coefficient should be 1.2 at production
	if ( Math.floor(Math.random() * 1.1) == 1 ) {
		mineArray[y][x] = "M";

		iterateAdjascent(y, x, (y, x)=>{

			if (mineArray[y][x] != "M") {
				mineArray[y][x]++
			}

		});

	}

} 

function iterateSequentially (callback) {
	// Perform a function on each space of the minefield sequentially.

	for (i=0; i<mineArray.length; i++) {

		for (j=0; j< mineArray[i].length; j++) {

			callback(j, i);

		}

	}

}

function iterateAdjascent (y, x, callback) {
	// Perform a function on a given space and on each space touching the given space.

	var k;
	var m;

	for ( k = y-1; k < y + 2; k++) {

		if ( k < 0 || k > height-1 ) {
			continue
		}

		//console.log("k = " + k + ", y = " + y);

		for ( m = x-1; m < x+2; m++ ) {

			if ( m < 0 || m > height-1 ) {
				continue
			}

			//console.log("m = " + m + ", x = " + x);

			console.log("From " + y + "," + x + ": " + k + "," + m);

			callback( k,m );

		}

	}

	delete(k);
	delete(m);

}

function getSpaceFromCoords ( y, x ) {

	const minefield = document.getElementById("minefield");

	const row = Array.from(minefield.children)[y];

	const space = Array.from(row.children)[x];

	return space

}

function clickSpace ( event ) {

	if ( event.button === 2 ) {
		return
	}

	const x = event.target.dataset.x;
	const y = event.target.dataset.y;

	console.log("CLICKED " + y + ", " + x + ": " + mineArray[y][x]);

	if (mineArray[y][x] == "M") {

		gameOver();

		return

	}

	const space = getSpaceFromCoords( y, x );

	if (space == null) {
		return
	}

	if(space.style.background != ""){
		return
	}

	space.style.setProperty("background", "hsl(0, 0%, 90%)");

	if (mineArray[y][x] == 0) {

		console.log("ZERO " + x + ", " + y + ": " + mineArray[y][x]);

		iterateAdjascent(y, x, ( y, x )=>{ getSpaceFromCoords( y, x ).click(); });

	} else {

		space.innerText = mineArray[y][x];

	}

}

function gameOver() {
	// End the game, preventing further actions and displaying each mine on the field.

	console.log("GAME OVER //////////////////////////////////////////////////////");
	
	iterateSequentially(( y, x )=>{

		const minefield = document.getElementById("minefield");

		const row = Array.from(minefield.children)[y];

		const space = Array.from(row.children)[x];

		space.setAttribute("onclick", "");

		if ( mineArray[y][x] == "M" ) {

			space.style.setProperty("background", "url(./img/bomb.png)");

		}

	});

}