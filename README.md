# Football Manager App

This is a Football Manager app, where a team can be managed, players added, deleted or updated. And a view of the team’s formation is visible with the starters being shown in the field.
## Authors

- [@Shubhadeep Mahato](https://www.linkedin.com/in/shubhadeep-mahato-24136621b/)


## Documentation

## Features

### Roster Details
#### Editable Team Name
- The edit icon is always visible if the team name has not been changed.
- After changing the name once, the icon is visible only when hovering over the name.

#### Search Field
- Search players by name and/or position.
- Filter based on the complete name or a substring.
- Keystrokes:
  - Along with search it willl reflect the result on the table
  - Escape (ESC): Cancel the search and clear the criteria.
  - After searching, clicking 'x' removes the search and shows all results.

#### Roster Importer
- Error handling:
  - Ensure the file contains no empty values.
  - Only accept .csv files.
- Show a summary of player counts and positions.
- If a roster exists, the import button changes to "Re-Import," clearing and refreshing the state.

#### Roster Table
- Display player data from the application state.
- Show a message if the state is empty.
- Include country flags for each player.
- Display Height and Weight in readable formats.
- Actions menu for editing or deleting players.
  - Validate all fields before allowing an edit.
  - Confirm user intent before deleting.

### Formation Overview
#### Formation Preview
- Display the 4-3-3 formation with players positioned accordingly.
- Show a circle for each player with jersey number and player name.
- Check starters for each position (Goalkeeper, Defender, Midfielder, Forward).
- Conditions to display the formation:
  - There is a roster.
  - There are enough starters.
  - There aren't too many starters.
- Show respective messages if conditions are not met.

#### Player Details
- See details about players in the formation.
- By default, goalkeeper details are shown.
- Click on a player to see their details.
- Show information and stats related to the player:
  - For Goalkeepers: Clean Sheets and Saves.
  - For other positions: Goals and Assists.
  - All positions have Appearance and Minutes Played.

## Usage
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the application: `npm run start` 
## Deployment
This application is deployed using [Netlify](https://footballmanagement.netlify.app/). View the live 

## Contributing
Feel free to contribute to the project. Create a pull request and open issues for improvements.

## License
This project is licensed under the [MIT License](LICENSE).

