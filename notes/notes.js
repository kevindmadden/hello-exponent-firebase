Turf War Game:
	Basics:

		User Taps Grid Square:
			Loop: check if there is already an existing problem for the square
				If there is an existing problem for the square, then…
					User is shown existing problem
					If user provides the first correct solution, then…
						Square turns user’s color
					If user provides an incorrect solution…
						Notify user
						Put 90 (?) second timer on grid square for everyone on user’s team (the team cannot submit another solution until timer elapses)
						Kick user out to main grid
					Listener: If a different user provides the correct solution first, then…
						Notify user
						Show user the solution
						Kick user out to main grid
				Otherwise, user pushes new problem

		Possible Grid Square States

			user = { team : 'blue' }

			/* square_r#_c#
				0	1	2	3	4 -	c
			0
			1
			2
			3
			|
			r
			*/
			grid = {
				square_r0_c0 : { owner : 'blue', r:0,c:0 },
				square_r0_c1 : { owner : 'none', r:0,c:1 },
				square_r1_c0 : { owner : 'green', r:1,c:0 },
			}
			function updateSquare(squareName){
				IS_TEAM_OWNED_SQUARE = squareName.owner == user.team ? true : false //a square that is owned by the user’s team
				IS_OWNED_SQUARE = squareName.owner != 'none' ? true : false //a square that is owned by either the user's team or another team
				IS_ADJACENT_TO_TEAM_OWNED_SQUARE = (() => { //a square that is adjacent to a square that is owned by the uder's team
					let adjacentSquares = {
						above_square : grid['square_r'+(squareName.r)+'_c'+(squareName.c-1)],
						below_square : grid['square_r'+(squareName.r)+'_c'+(squareName.c+1)],
						left_square : grid['square_r'+(squareName.r-1)'_c'+(squareName.c)],
						right_square : grid['square_r'+(squareName.r+1)'_c'+(squareName.c)]
					}
					for(adjacentSquare in adjacentSquares){
						if(adjacentSquare != undefined && adjacentSquare.owner==user.team) return true
					}
					return false
				})();

				if(IS_TEAM_OWNED_SQUARE){

				}else{ //!IS_TEAM_OWNED_SQUARE
					if(IS_ADJACENT_TO_TEAM_OWNED_SQUARE){
						if(squareName.owner=='none'){

						}else{//squareName.owner!='none'

						}
					}else{

					}
				}
				if(!IS_OWNED_SQUARE)

				if(isAdjacentToTeamSquare(square))

			}

			!(TEAM_OWNED_SQUARE) is Adjacent to TEAM_OWNED_SQUARE
				If NOT_OWNED_SQUARE: White / square outline with ‘+’ in corner (https://thenounproject.com/search/?q=add&i=1821803)
				If OWNED_SQUARE: Other team’s color / other team’s icon / attack icon of some sort (indicating that the square can be taken over)
			!(TEAM_OWNED_SQUARE) is NOT Adjacent to TEAM_OWNED_SQUARE
				No Team Owns: White / square outline
				Other Team Owns: Other team’s color / other team’s icon
			Grid Square Not Adjacent
			No team owns grid square yet
				Other team(s) attempting to own
				User’s team attempting to own
				User’s team and other team(s) attempting to own
				No team is attempting to own
					Color: white, Icon:
			User’s team owns grid square
			Other team owns grid square
