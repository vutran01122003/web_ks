import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoSend } from 'react-icons/io5';
import { RiBubbleChartFill } from 'react-icons/ri';
import { sendChat, getTypeChat } from '../redux/actions/chatbotAction';
import { Button } from 'antd';
import { FaArrowDown } from 'react-icons/fa6';
import { chatbotSelector } from '../redux/selector';
import GLOBALTYPES from '../redux/actions/globalTypes';
import Markdown from 'react-markdown';
const Chat = () => {
    const dispatch = useDispatch();
    const chatbot = useSelector(chatbotSelector);
    const chatContainerRef = useRef(null);
    const [question, setQuestion] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [typeChat, setTypeChat] = useState(null);
    const [showOption, setShowOption] = useState(false);
    useEffect(() => {
        dispatch(getTypeChat());
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [JSON.stringify(chatbot.data)]);
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop =
                chatContainer.scrollHeight - chatContainer.clientHeight;
            const handleScroll = () => {
                setShowScrollButton(
                    chatContainer.scrollTop <
                        chatContainer.scrollHeight -
                            chatContainer.clientHeight -
                            200,
                );
            };
            chatContainer.addEventListener('scroll', handleScroll);
            return () => {
                chatContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [chatContainerRef?.current]);

    const sendQuestion = (e) => {
        e.preventDefault();
        if (question && !chatbot.isLoading) {
            dispatch({
                type: GLOBALTYPES.CHATBOT.SET_CHATBOT_DATA,
                payload: {
                    key: 'question',
                    data: question,
                },
            });
            dispatch(sendChat(question, typeChat));
            setQuestion('');
        }
        return;
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendQuestion(event);
        }
        return;
    };

    const scrollToBottom = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    //Bắt liên kết văn bản trả về từ chatbot
    const TextLink = ({ text }) => {
        const regex = /(https?:\/\/[^\s]+)/g;
        const matches = text.split(regex);
        return (
            <div className="chat-message__content">
                {matches.map((part, index) =>
                    index % 2 === 0 ? (
                        // Phần tử có chỉ số chẵn là văn bản
                        <div key={index}>
                            <Markdown>{part}</Markdown>
                        </div>
                    ) : (
                        // Phần tử có chỉ số lẻ là liên kết
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {part}
                        </a>
                    ),
                )}
            </div>
        );
    };
    const handleTypeChat =
        ({ item }) =>
        () => {
            if (item !== typeChat) {
                setTypeChat(item);
                chatbot.data = [];
            }
        };
    return (
        <div className="pageChatbot">
            <div className="chat-content" ref={chatContainerRef}>
                {chatbot.typeChat && typeChat ? (
                    chatbot.data.map((item, index) => (
                        <div key={index}>
                            <div className="user-message">
                                <div className="user-message__content">
                                    {item.question}
                                </div>
                            </div>
                            {item.answer ? (
                                <div className="chat-message">
                                    <div className="chat-info">
                                        <RiBubbleChartFill />{' '}
                                    </div>
                                    <TextLink text={item?.answer} />
                                </div>
                            ) : (
                                <img
                                    src={
                                        import.meta.env.VITE_APP_CHATBOT_LOADING
                                    }
                                    className="chatbot-loading"
                                    alt="loading"
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="choice-type">
                        <div className="choice-type__container">
                            {chatbot.typeChat && !typeChat && (
                                <div className="choice-type__title">
                                    Vui lòng chọn loại chatbot
                                </div>
                            )}
                            <div className="choice-type__list">
                                {chatbot.typeChat &&
                                    !typeChat &&
                                    chatbot.typeChat.map((item, index) => (
                                        <div
                                            key={index}
                                            className="choice-type__item"
                                            onClick={handleTypeChat({ item })}
                                        >
                                            {item}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {chatbot.typeChat && typeChat && (
                <div className="chat-box">
                    {showScrollButton && (
                        <button
                            className="scroll-to-bottom-button"
                            onClick={scrollToBottom}
                        >
                            <FaArrowDown />
                        </button>
                    )}
                    <div className="chat-box__container">
                        <div className="chat-input__container">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                    setShowOption(false);
                                }}
                                className="user-input-field"
                                placeholder="Nhập câu hỏi của bạn tại đây"
                                onKeyDown={handleKeyPress}
                            />
                            <Button
                                type="primary"
                                loading={chatbot.isLoading}
                                onClick={(e) => {
                                    question != ''
                                        ? sendQuestion(e)
                                        : setShowOption(!showOption);
                                }}
                                className={`chat-button ${!question && 'input-empty'}`}
                                disabled={chatbot.isLoading || !question}
                            >
                                {!chatbot.isLoading && <IoSend />}

                                {/* {showOption && (
									<div className="option-type">
										{chatbot.typeChat.map((item, index) => (
											<div
												key={index}
												className={`option-type__item`}
												onClick={handleTypeChat({ item })}
											>
												<div className="number">{index + 1} </div>
												<div className="text">{item}</div>
											</div>
										))}
									</div>
								)} */}
                            </Button>
                        </div>
                    </div>
                    <div className="chat-warning">
                        Thông tin của IUH chat có thể còn chưa chính xác do còn
                        trong quá trình thử nghiệm
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
