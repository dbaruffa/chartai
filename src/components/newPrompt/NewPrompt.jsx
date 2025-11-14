import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import ai from "../../lib/gemini"
import Markdown from "react-markdown"
import * as fs from "node:fs";
import { createPartFromUri, createUserContent } from '@google/genai';
import { useLocation } from 'react-router-dom';

const NewPrompt = ({chatList, setChatList}) => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [localFile, setLocalFile] = useState();
    const [aiFile, setAiFile] = useState();

    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const endRef = useRef(null);
    const formRef = useRef(null);

    const aiChat = ai.chats.create({
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
        if(query && query.length > 0) {
            let answerText = "";

            try {
                let message = query;

                if(aiFile) {
                    message = createUserContent([
                        createPartFromUri(aiFile.uri, aiFile.mimeType),
                        query,
                    ]);
                }

                const response = await aiChat.sendMessageStream({
                    message: message,
                    //config:
                });

                for await (const chunk of response) {
                    answerText += chunk.text;
                    setAnswer(answerText);
                }
            }
            catch(err) {
                answerText = "Failed to query model:\n" + err.toString();
            }

            // Full answer is here. Insert query and answer (and image) into chat history.
            setChatList((chats) => chats.map((chat) => {
                if(chat.id === chatId) {
                    return {
                        ...chat,
                        history: [
                            ...chat.history,
                            {
                                role: "user",
                                text: query || "",
                                imgPath: localFile,
                                timestamp: Date.now()
                            },
                            {
                                role: "model",
                                text: answerText || "",
                                imgPath: null,
                                timestamp: Date.now()
                            }
                        ]
                    };
                }
                else
                {
                    return {
                        ...chat,
                        history: [...chat.history]
                    };
                }
            }));

            setQuery("");
            setAnswer("");
            setLocalFile(null);
            setAiFile(null);
        }
    };

    useEffect(() => { handleQuery(); }, [query]);

    const onTextInput = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;

        if(text) {
            setQuery(text);
        }

        formRef?.current?.reset();
    };

    const onFileInput = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        
        if(file) {
            const fileUrl = URL.createObjectURL(file);
            setLocalFile(fileUrl);

            const myfile = await ai.files.upload({
                file: file,
                config: { mimeType: file.type },
            });

            setAiFile(myfile);
        }
    };

    return (
        <>
            {localFile && (<img src={localFile} alt="" id="image" />)}
            {query && <div className='message user'>{query}</div>}
            {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

            <div className='endChat' ref={endRef}></div>
            
            <form className='newForm' onSubmit={onTextInput} ref={formRef}>
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
