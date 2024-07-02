import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 4000;
app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type'], // Allow specific headers
  })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI("AIzaSyCKGDkfA1FeKWcicnRTSGyNsouDQmEv13g");

async function run(prompt) {
    prompt=prompt+' and give response in markdown only if possible';
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
}


app.post("/", async (req, res) => {
    const Inputprompt = req.body.prompt;
    try 
    {
       const response = await run(Inputprompt);
        console.log(response);
        res.json({ response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error  });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
