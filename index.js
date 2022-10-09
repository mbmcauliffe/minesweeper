var mineArray;

function newGame() {
	// Generate a new minefield with a given width and height.

	const width = parseInt(document.getElementById("newGameWidth").value);
	const height = parseInt(document.getElementById("newGameHeight").value);

	generateMineArray(width, height);

	const newTable = document.createDocumentFragment();

	for ( i=0; i< height; i++ ) {

		const row = newTable.appendChild(document.createElement('tr'));

		for ( j=0; j< width; j++ ) {

			const space = row.appendChild(document.createElement("td"));

			space.setAttribute("onclick", "clickSpace(" + j + "," + i + ");");

		}

	}

	const minefield = document.getElementById("minefield");
	minefield.style.setProperty("width", (width * 1.7) - 0.2 + "em");
	minefield.replaceChildren(newTable);

}

function generateMineArray ( width, height ) {
	// Generate an array with values for every space of a minefield of a given width and height.

	mineArray = [];

	// Populate an empty 2D array
	for (i=0; i<height; i++) {
		mineArray.push(Array.apply(null, new Array(width)));
	}

	// Fill array with zeros
	iterateSequentially((x, y)=>{

		mineArray[y][x] = 0;

	})

	// Place Mines
	iterateSequentially(placeMines);

}

function placeMines (x, y) {
	// Place a mine in a space based on random chance.

	if ( Math.floor(Math.random() * 1.1) == 1 ) {
		mineArray[y][x] = "M";

		iterateAdjascent(x, y, (x, y)=>{

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

function iterateAdjascent (x, y, callback) {
	// Perform a function on a given space and on each space touching the given space.

	for ( k= y-1; k <= y+1; k++ ) {

		if( k<0 || k == mineArray.length ){
			continue
		}

		for ( m= x-1; m <= x+1; m++ ) {

			if( m<0 || m == mineArray[k].length ){
				continue
			}

			callback(m, k);

		}

	}

}

function clickSpace (x, y) {

	const minefield = document.getElementById("minefield");

	const row = Array.from(minefield.children)[y];

	const space = Array.from(row.children)[x];

	if (mineArray[y][x] == "M") {

		gameOver();

		return

	}

	space.style.setProperty("background", "hsl(0, 0%, 90%)");

	if (mineArray[y][x] == 0) {

		iterateAdjascent(x, y, clickSpace);

	}

	space.innerText = mineArray[y][x];

}

function gameOver() {
	// End the game, preventing further actions and displaying each mine on the field.
	
	iterateSequentially(( x, y )=>{

		const minefield = document.getElementById("minefield");

		const row = Array.from(minefield.children)[y];

		const space = Array.from(row.children)[x];

		space.setAttribute("onclick", "");

		if ( mineArray[y][x] == "M" ) {

			space.style.setProperty("background", "url(./img/bomb.png)");

		}

	});

}