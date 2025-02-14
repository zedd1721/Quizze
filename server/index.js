const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoutes');
const { default: mongoose } = require("mongoose");
dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);




const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
