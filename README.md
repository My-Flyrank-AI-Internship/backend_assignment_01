# FlyRank Backend Assignment

A minimal Express.js backend that demonstrates the request → response cycle using two JSON endpoints.

## Tech Stack

- Node.js
- Express.js

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
```

2. Navigate to the project:

```bash
cd backend-assignment
```

3. Install dependencies:

```bash
npm install
```

## Run the Server

```bash
npm start
```

The server will start at:

```
http://localhost:3000
```

## API Endpoints

### GET /

Returns a welcome message.

Example response:

```json
{
  "message": "Hello, FlyRank!"
}
```

---

### GET /about

Returns basic information.

Example response:

```json
{
  "name": "Krishna",
  "role": "Backend AI Engineering Intern"
}
```

## Testing

### Browser

Visit:

- http://localhost:3000/
- http://localhost:3000/about

### curl

```bash
curl http://localhost:3000/
```

```bash
curl http://localhost:3000/about
```

## Project Structure

```
backend-assignment/
│── server.js
│── package.json
│── package-lock.json
│── .gitignore
└── README.md
```

## Author

**Krishna**