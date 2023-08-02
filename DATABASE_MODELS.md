# Database design for battleHost Application.

### User Model:

| Field       | Type               | Description                                  |
|-------------|--------------------|----------------------------------------------|
| _id         | ObjectId           | Unique identifier for the user               |
| name        | String             | User's username                              |
| email       | String             | User's email                                 |
| password    | String             | User's hashed password                       |
| role        | String             | User's role (e.g., participant, organizer(host))   |
| phone        | int             | Mobile number   |

### Tournament/Contest Model:

| Field          | Type                | Description                                    |
|----------------|---------------------|------------------------------------------------|
| _id            | ObjectId            | Unique identifier for the tournament           |
| name           | String              | Tournament name                                |
| description    | String              | Description of the tournament                  |
| organizerId    | ObjectId (Reference)| ID of the user (organizer) who created the tournament |
| categories     | [ObjectId (Reference)]| (Optional) Array of category IDs to which the tournament belongs |
| startDateTime  | Date                | Start date and time of the tournament          |
| endDateTime    | Date                | End date and time of the tournament            |
| rules          | String              | Rules and regulations for the tournament       |
| prizes         | [{name, description}]| Array of prize objects with name and description|

### Category Model(Optional):

| Field          | Type               | Description                             |
|----------------|--------------------|-----------------------------------------|
| _id            | ObjectId           | Unique identifier for the category      |
| name           | String             | Category name                           |
| description    | String             | Description of the category             |


### Register Tournament Model

| Field            | Type                          | Description                                                |
|------------------|-------------------------------|------------------------------------------------------------|
| user             | ObjectId (Reference to User)  | The ID of the user registering for the tournament.        |
| tournament       | ObjectId (Reference to Tournament) | The ID of the tournament being registered for.       |
| registrationType | String                        | Indicates whether the registration is for 'individual' or 'team'. Possible values: 'individual' or 'team'. Default: 'individual'. |
| teamName         | String                        | Required if registrationType is 'team'. The name of the team registering for the tournament. |
| teamMembers      | Array of ObjectId (Reference to User) | Required if registrationType is 'team'. An array of user IDs representing the team members. |
| registrationDate | Date                          | The date when the registration was made. Default: Current date and time. |


### Match Model:

| Field          | Type                | Description                                    |
|----------------|---------------------|------------------------------------------------|
| _id            | ObjectId            | Unique identifier for the match                |
| tournamentId   | ObjectId (Reference)| ID of the tournament to which the match belongs |
| round          | Number              | Round number of the match                      |
| startTime      | Date                | Start date and time of the match               |
| endTime        | Date                | End date and time of the match                 |
| participants   | [{participantId, score}]| Array of participant objects with their IDs and scores |
| location       | String              | Location or venue of the match (optional)      |
| matchDetails   | String              | Additional details about the match (optional)  |

### Result Model:

| Field          | Type                | Description                                    |
|----------------|---------------------|------------------------------------------------|
| _id            | ObjectId            | Unique identifier for the result               |
| matchId        | ObjectId (Reference)| ID of the match to which the result belongs    |
| participantId  | ObjectId (Reference)| ID of the participant or team with the result  |
| score          | Number              | Score achieved by the participant in the match |
