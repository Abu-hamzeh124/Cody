import express from 'express';
import type { Request, Response, Application } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server effectively running on port: ${PORT}`);
});
