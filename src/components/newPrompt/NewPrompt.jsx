import { useEffect, useRef, useState } from 'react'
import './newPrompt.css'
import ai from "../../lib/gemini"
import Markdown from "react-markdown"
import { createPartFromUri, createUserContent } from '@google/genai';
import { useLocation } from 'react-router-dom';

const NewPrompt = ({chatList, setChatList}) => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [localFile, setLocalFile] = useState();
    const [aiFile, setAiFile] = useState();

    const path = useLocation().pathname;
    const chatId = path.split("/").pop();
    const myChat = chatList.find(chat => chat.id === chatId);

    const endRef = useRef(null);
    const formRef = useRef(null);

    const aiChat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: myChat? myChat.history.map(({role, text}) => ({role, parts: [{text}]})) : [],
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

    const sendQueryToModel = async (text) => {
        if(!text || text.length <= 0) return;

        let answerText = "";

        try {
            let message = text;

            if(aiFile) {
                message = createUserContent([
                    createPartFromUri(aiFile.uri, aiFile.mimeType),
                    text,
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
            let obj = err;
            let message = obj.toString();

            while(obj && obj !== message) {
                if(obj?.message) {
                    message = obj.message;
                    obj = obj.message;
                } else if(obj?.error) {
                    obj = obj.error;
                }
                else {
                    try {
                        obj = JSON.parse(message);
                    }
                    catch { }
                }
            }

            answerText = "Failed to query model: " + message;
        }

        // Full answer is here. Insert query and answer (and image) into chat history.
        setChatList((chats) => chats.map((chat) => {
            if(chat.id === chatId) {
                return {
                    ...chat,
                    history: [
                        ...chat.history,
                        // Optionally insert query if it is there (do not use the parameter "text").
                        ...(query && query.length > 0? 
                            [{
                                role: "user",
                                text: query || "",
                                imgPath: localFile,
                                timestamp: Date.now()
                            }] : 
                            []),
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
    };

    const handleQuery = async () => {
        if(query && query.length > 0) {
            sendQueryToModel(query);
        }
    };

    useEffect(() => { handleQuery(); }, [query]);

    // If the chat is newly created (via Dashboard), make sure to send the initial query to the model.
    // Make sure to only run the function once.
    const hasSetFirstQuery = useRef(false);

    useEffect(() => {
        if(!hasSetFirstQuery.current) {
            if (myChat?.history.length === 1) {
                sendQueryToModel(myChat.history[0].text);
            }
        }

        hasSetFirstQuery.current = true;
    }, []);

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
