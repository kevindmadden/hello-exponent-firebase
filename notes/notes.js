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
			/*
			Teacher creates Game
				Select Class
					Pick number of teams (4-8 players per team is recommended)
					Select grid size (there will be a recommended size): Small Medium Large
					Pick Teams
						Pull list of players in class
							Attach listener for new players that join class so that they automatically appear as they join
						List player names, one per row:
							# PlayerName o * # $
							* PlayerName o * # $
						Put button on right side; when a button is pressed, icon gets copied over to left side (see example above)
						When an icon is assigned to a player, update players.playerid with the team that corresponds to the icon
					Start Game
						Allow players to start playing
						Alert players with the app open that the game is starting
			*/

			//Firebase data format
			//when user answers problem correctly, check in a transaction that the problem answered has the problemId
			//   if it does, then...
			//									update the owner in publicData and clear the current problemId
			//									clear all the solvers from the grid square (i.e. delete the node for the grid square in solvers)
			//if there is not problemId and a user clicks on square, update in a transaction the problemId
			gameId : {
				gameInformation : {
					gameType : 'turf war',
					gridSize : {r:10,c:10},
					teams : {'blue','green','red'},
				},
				players : {
					playerid1 : 'green',
					playerid2 : 'blue',
					playerid3 : 'blue',
					playerid4 : 'green',
					playerid5 : 'red',
				},
				owners : {
					'0_0' : {owner:'green', problemId:'currentIdThatNoOneHasYetSolved or empty_string' },
					'0_1' : {owner : 'green', home:{relLoc:{r:0,c:0},size:{r:2,c:2}}},
					'0_2' : {owner : 'green', home:{relLoc:{r:0,c:1},size:{r:2,c:2}}},
					'0_3' : {owner: 'green', problemId:''},
					'0_4' : {owner: '', problemId:'currentIdThatNoOneHasYetSolved2'},
					'0_5' : {owner: '', problemId:''},
					'0_6' : {owner: '', problemId:''},
					'1_0' : {owner: '', problemId:''},
					'1_1' : {owner : 'green', home:{relLoc:{r:1,c:0},size:{r:2,c:2}}},
					'1_2' : {owner : 'green', home:{relLoc:{r:1,c:1},size:{r:2,c:2}}},
				},
				solvers : {
					'0_0' : {'green':true,'blue':true},
					'0_4' : {'green':true},
				},
				problems : {
					'currentIdThatNoOneHasYetSolved' : {'problem stuff here'},
					'currentIdThatNoOneHasYetSolved2' : {'problem stuff here'},
				},
			}

			function updateSquare(squareName){
				const ADJACENT_SQUARES = 	{ above_square : grid['r'+(squareName.r)+'_c'+(squareName.c-1)],
																		below_square : grid['r'+(squareName.r)+'_c'+(squareName.c+1)],
																		left_square : grid['r'+(squareName.r-1)'_c'+(squareName.c)],
																		right_square : grid['r'+(squareName.r+1)'_c'+(squareName.c)] }
				const IS_TEAM_OWNED_SQUARE = squareName.owner == user.team ? true : false //a square that is owned by the user’s team
				const IS_HOME_SQUARE = squareName.home != undefined ? true : false
				const IS_TOP_LEFT_HOME_SQUARE = (squareName.home != undefined && squareName.home.relLoc != undefined && squareName.home.relLoc.r==0 && squareName.home.relLoc.c==0) ? true : false
				const IS_SQUARE_UNDER_ATTACK = squareName.solvers != undefined ? true : false //a square that is owned by the user’s team
				const IS_OWNED_SQUARE = squareName.owner != 'none' ? true : false //a square that is owned by either the user's team or another team
				const IS_ADJACENT_TO_TEAM_OWNED_SQUARE = Object.values(ADJACENT_SQUARES).some(sq => sq!=undefined && sq.owner==user.team)  //a square that is adjacent to a square that is owned by the user's team
				/*const IS_ADJACENT_TO_TEAM_OWNED_SQUARE = (() => { //a square that is adjacent to a square that is owned by the user's team
					for(adjacentSquareKey in ADJACENT_SQUARES){
						let adjacentSquare = ADJACENT_SQUARES[adjacentSquareKey]
						if(adjacentSquare != undefined && adjacentSquare.owner==user.team) return true
					}
					return false
				})();*/

				if(IS_TEAM_OWNED_SQUARE &&  IS_SQUARE_UNDER_ATTACK && !IS_HOME_SQUARE){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = "some sort of icon with a shield indicating possibility to defend"
				}
				if(IS_TEAM_OWNED_SQUARE &&  IS_SQUARE_UNDER_ATTACK && IS_HOME_SQUARE && IS_TOP_LEFT_HOME_SQUARE){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = null
				}
				if(IS_TEAM_OWNED_SQUARE && !IS_SQUARE_UNDER_ATTACK && !IS_HOME_SQUARE){
					squareName.icon = 'icon that corresponds to squareName.owner'
					squareName.secondaryIcon = null
				}

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
