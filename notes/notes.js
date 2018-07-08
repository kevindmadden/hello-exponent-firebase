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
				square_r0_c0 : { owner : 'blue', r:0, c:0, attackers:{'longrandomkeyid':'green'} },
				square_r0_c1 : { owner : 'none', r:0, c:1 },
				square_r1_c0 : { owner : 'green', r:1, c:0 },
				square_r2_c0 : { owner : 'green', home:{relLoc:{r:0,c:0},size:{r:2,c:2}}, r:2, c:0 }
				square_r2_c1 : { owner : 'green', home:{relLoc:{r:0,c:1},size:{r:2,c:2}}, r:2, c:1 }
			}
			function updateSquare(squareName){
				const ADJACENT_SQUARES = 	{ above_square : grid['square_r'+(squareName.r)+'_c'+(squareName.c-1)],
																		below_square : grid['square_r'+(squareName.r)+'_c'+(squareName.c+1)],
																		left_square : grid['square_r'+(squareName.r-1)'_c'+(squareName.c)],
																		right_square : grid['square_r'+(squareName.r+1)'_c'+(squareName.c)] }
				const IS_TEAM_OWNED_SQUARE = squareName.owner == user.team ? true : false //a square that is owned by the user’s team
				const IS_HOME_SQUARE = squareName.home != undefined ? true : false
				const IS_SQUARE_UNDER_ATTACK = (squareName.attakers !== undefined) ? true : false //a square that is owned by the user’s team
				const IS_OWNED_SQUARE = squareName.owner != 'none' ? true : false //a square that is owned by either the user's team or another team
				const IS_ADJACENT_TO_TEAM_OWNED_SQUARE = Object.values(ADJACENT_SQUARES).some(sq => sq!=undefined && sq.owner==user.team)  //a square that is adjacent to a square that is owned by the user's team
				/*const IS_ADJACENT_TO_TEAM_OWNED_SQUARE = (() => { //a square that is adjacent to a square that is owned by the user's team
					for(adjacentSquareKey in ADJACENT_SQUARES){
						let adjacentSquare = ADJACENT_SQUARES[adjacentSquareKey]
						if(adjacentSquare != undefined && adjacentSquare.owner==user.team) return true
					}
					return false
				})();*/

				if( IS_TEAM_OWNED_SQUARE &&  IS_SQUARE_UNDER_ATTACK){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = "some sort of icon with a shield indicating possibility to defend"
				}
				if( IS_TEAM_OWNED_SQUARE && !IS_SQUARE_UNDER_ATTACK){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = null
				}

				//need logic to handle larger home base square(s)

				if(!IS_TEAM_OWNED_SQUARE &&  IS_ADJACENT_TO_TEAM_OWNED_SQUARE &&  IS_OWNED_SQUARE){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = "attack icon of some sort (indicating that the square can be taken over by the user's team)"
				}
				if(!IS_TEAM_OWNED_SQUARE &&  IS_ADJACENT_TO_TEAM_OWNED_SQUARE && !IS_OWNED_SQUARE){
					squareName.icon = 'square outline with + in the corner (https://thenounproject.com/search/?q=add&i=1821803)'
					squareName.secondaryIcon = null
				}
				if(!IS_TEAM_OWNED_SQUARE && !IS_ADJACENT_TO_TEAM_OWNED_SQUARE &&  IS_OWNED_SQUARE){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = null
				}
				if(!IS_TEAM_OWNED_SQUARE && !IS_ADJACENT_TO_TEAM_OWNED_SQUARE && !IS_OWNED_SQUARE){
					squareName.icon = 'square outline without + in the corner (https://thenounproject.com/search/?q=add&i=1821803)'
					squareName.secondaryIcon = null
				}


			}

			Grid Square Not Adjacent
			No team owns grid square yet
				Other team(s) attempting to own
				User’s team attempting to own
				User’s team and other team(s) attempting to own
				No team is attempting to own
					Color: white, Icon:
			User’s team owns grid square
			Other team owns grid square
