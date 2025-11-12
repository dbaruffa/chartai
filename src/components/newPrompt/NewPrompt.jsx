import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import ai from "../../lib/gemini"
import Markdown from "react-markdown"
import * as fs from "node:fs";
import { createPartFromUri, createUserContent } from '@google/genai';

const NewPrompt = () => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [localFile, setLocalFile] = useState("");
    const [aiFile, setAiFile] = useState("");

    const endRef = useRef(null)

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
            /*{
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },*/
        ],
        config: {
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_LOW_AND_ABOVE",
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_LOW_AND_ABOVE",
                },
            ],
            //maxOutputTokens: 200,
        },
    });

    useEffect(() => {
        endRef.current.scrollIntoView()
    }, [query, answer, localFile]);

    const handleQuery = async () => {
        if(query) {
            const response = await chat.sendMessageStream({
                message: query,
                //config:
            });
            
            console.log("sendMessageStream");
            console.log(response);

            let answer = "";

            for await (const chunk of response) {
                console.log("Received chunk: ", chunk.text);
                answer += chunk.text;
                setAnswer(answer);
            }

            console.log("End of handleQuery");

            //setAnswer("I received this query: " + query);
        }
    };

    useEffect(() => { handleQuery(); }, [query]);

    const handleLocalFile = async () => {
        if(localFile) {
            const myfile = await ai.files.upload({
                file: localFile,
                config: { mimeType: localFile.type },
            });

            setAiFile(myfile);
        }
    }

    useEffect(() => { handleLocalFile(); }, [localFile]);

    const handleAiFile = async () => {
        if(aiFile) {
            console.log("Asking model to describe file ", aiFile.name);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: createUserContent([
                    createPartFromUri(aiFile.uri, aiFile.mimeType),
                    "Write one sentence about this file.",
                ]),
            });

            setAnswer(response.text);
        }
    };

    useEffect(() => { handleAiFile(); }, [aiFile]);

    const onTextInput = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;

        if(text) {
            setQuery(text);
        }
    };

    const onFileInput = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if(file) {
            setLocalFile(file);
        }
    };

    return (
        <>
            {query && <div className='message user'>{query}</div>}
            {localFile && (<img src={URL.createObjectURL(localFile)} alt="" id="image" />)}
            {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

            <div className='endChat' ref={endRef}></div>
            
            <form className='newForm' onSubmit={onTextInput}>
                <label htmlFor="file">
                    <img src="/attachment.png" alt=""></img>
                </label>
                <input id="file" type="file" multiple={false} hidden onChange={onFileInput} />
                <input type="text" name="text" placeholder='Ask me anything...' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    )
}

export default NewPrompt;
